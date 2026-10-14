import { render, screen, fireEvent, act } from "@testing-library/react";
import Predictor from "./Predictor";

const uploadPhoto = () => {
  const file = new File(["dummy"], "leaf.png", { type: "image/png" });
  fireEvent.change(screen.getByLabelText(/upload crop photo/i), {
    target: { files: [file] },
  });
};

beforeEach(() => {
  // jsdom does not implement these
  global.URL.createObjectURL = jest.fn(() => "blob:mock-leaf");
  global.URL.revokeObjectURL = jest.fn();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("renders the upload control and a disabled analyze button", () => {
  render(<Predictor />);

  expect(screen.getByLabelText(/upload crop photo/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /analyze image/i })).toBeDisabled();
  expect(screen.getByText(/no diagnosis yet/i)).toBeInTheDocument();
});

test("shows a preview and enables analyze when a photo is selected", () => {
  render(<Predictor />);

  uploadPhoto();

  expect(screen.getByRole("img", { name: /uploaded crop leaf/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /analyze image/i })).toBeEnabled();
});

test("shows a diagnosis after analyzing", () => {
  jest.useFakeTimers();
  // Math.random() = 0 picks the first disease in the list
  jest.spyOn(Math, "random").mockReturnValue(0);
  render(<Predictor />);

  uploadPhoto();
  fireEvent.click(screen.getByRole("button", { name: /analyze image/i }));

  // While analyzing, the button is disabled and shows progress
  expect(screen.getByRole("button", { name: /analyzing/i })).toBeDisabled();

  act(() => {
    jest.advanceTimersByTime(1300);
  });

  expect(screen.getByRole("heading", { name: "Leaf Blight" })).toBeInTheDocument();
  expect(screen.getByText(/treatment recommendations/i)).toBeInTheDocument();
  expect(screen.getByText(/apply fungicide/i)).toBeInTheDocument();
});

test("keeps the assistant closed until the button is clicked", () => {
  render(<Predictor />);

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /ask assistant/i }));

  expect(screen.getByRole("dialog", { name: /nomasense assistant/i })).toBeInTheDocument();
  expect(screen.getByText(/upload a photo and i'll help diagnose/i)).toBeInTheDocument();
});

test("assistant answers a keyword question", () => {
  render(<Predictor />);

  fireEvent.click(screen.getByRole("button", { name: /ask assistant/i }));
  fireEvent.change(screen.getByLabelText(/message the assistant/i), {
    target: { value: "What about blight?" },
  });
  fireEvent.click(screen.getByRole("button", { name: /^send$/i }));

  expect(screen.getByText("What about blight?")).toBeInTheDocument();
  expect(
    screen.getByText(/use fungicide and remove affected leaves immediately/i)
  ).toBeInTheDocument();
});

test("closes the assistant with the close button and with Escape", () => {
  render(<Predictor />);

  fireEvent.click(screen.getByRole("button", { name: /ask assistant/i }));
  fireEvent.click(screen.getByRole("button", { name: /close assistant/i }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /ask assistant/i }));
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
