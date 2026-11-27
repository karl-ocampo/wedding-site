const form = document.querySelector("#lookup-form");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const lookupButton = document.querySelector("#lookup-button");
const resultDialog = document.querySelector("#result-dialog");
const resultClose = document.querySelector("#result-close");
const resultDone = document.querySelector("#result-done");
const resultEyebrow = document.querySelector("#result-eyebrow");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");

let guests = [];

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function closeResult() {
  if (resultDialog?.open) {
    resultDialog.close();
  }
}

function showMessage(state, message, heading = "") {
  if (!resultDialog || !resultEyebrow || !resultTitle || !resultMessage) {
    alert(`${heading ? `${heading}\n\n` : ""}${message}`);
    return;
  }

  resultDialog.dataset.state = state;
  resultEyebrow.textContent = state === "success" ? "Seat assignment" : "Please try again";
  resultTitle.textContent = heading || (state === "success" ? "Your seat" : "We need another detail");
  resultMessage.textContent = message;

  if (!resultDialog.open) {
    resultDialog.showModal();
  }
}

if (resultClose && resultDone && resultDialog) {
  resultClose.addEventListener("click", closeResult);
  resultDone.addEventListener("click", closeResult);

  resultDialog.addEventListener("click", (event) => {
    if (event.target === resultDialog) {
      closeResult();
    }
  });

  resultDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeResult();
  });
}

async function loadGuests() {
  try {
    const response = await fetch("./guests.json");
    if (!response.ok) {
      throw new Error("Guest list could not be loaded.");
    }

    const data = await response.json();
    if (!Array.isArray(data) || !data.every(validGuest)) {
      throw new Error("Guest list has an invalid format.");
    }

    guests = data;
    lookupButton.disabled = false;
  } catch (error) {
    showMessage("error", "Please ask a member of the wedding team for your seat assignment.", "The lookup is unavailable");
  }
}

function validGuest(guest) {
  return guest
    && Array.isArray(guest.firstNames)
    && guest.firstNames.length > 0
    && guest.firstNames.every((name) => typeof name === "string" && name.trim())
    && typeof guest.lastName === "string"
    && guest.lastName.trim()
    && typeof guest.seatNumber === "string"
    && guest.seatNumber.trim();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const submittedFirstNames = normalize(firstNameInput.value).split(" ").filter(Boolean);
  const submittedLastName = normalize(lastNameInput.value);

  if (!submittedFirstNames.length || !submittedLastName) {
    showMessage("error", "Enter both your first name and last name to continue.");
    return;
  }

  const matches = guests.filter((guest) => {
    const guestFirstNames = guest.firstNames.flatMap((name) => normalize(name).split(" "));
    return normalize(guest.lastName) === submittedLastName
      && submittedFirstNames.every((name) => guestFirstNames.includes(name));
  });

  if (matches.length === 1) {
    const guest = matches[0];
    showMessage("success", `Your seat is ${guest.seatNumber}.`, `${guest.firstNames.join(" ")} ${guest.lastName}`);
  } else if (matches.length > 1) {
    showMessage("error", "More than one guest matches. Add another given name and try again.");
  } else {
    showMessage("error", "We couldn't find a matching seat. Check the spelling and try again.");
  }
});

loadGuests();