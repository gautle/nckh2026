const options = document.querySelectorAll(".option");
const result = document.getElementById("result");

options.forEach((button) => {
  button.addEventListener("click", () => {
    const correct = button.dataset.answer === "yes";
    result.textContent = correct
      ? "Correct. The Pacific Ocean is the largest."
      : "Not quite. Try again.";
  });
});
