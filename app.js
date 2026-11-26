const form = document.querySelector("#lookup-form");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const lookupButton = document.querySelector("#lookup-button");
const result = document.querySelector("#result");

let guests = [];

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function showMessage(state, message, heading = "") {
  result.replaceChildren();
  result.dataset.state = state;

  if (heading) {
    const headingElement = document.createElement("h3");
    headingElement.textContent = heading;
    result.append(headingElement);
  }

  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  result.append(messageElement);
  result.hidden = false;
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