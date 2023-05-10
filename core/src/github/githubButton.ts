// In the future I will embed a button in the GitHub UI to open the libraries

/*
const buttonDiv = getRepositoryButtonDiv();

if (buttonDiv) {
  buttonDiv.appendChild(librariesButton);
}

*/
const librariesButton = document.createElement('a');
librariesButton.classList.add(
  'UnderlineNav-item',
  'no-wrap',
  'js-responsive-underlinenav-item',
  'v-item',
  'js-selected-navigation-item'
);
librariesButton.innerText = 'Libraries';
librariesButton.onclick = () => {
  // Not Yet Implemented
};
export function disableButton() {
  librariesButton.onclick = () => {
    // Do Nothing
  };
  librariesButton.innerText = 'No Libraries Found';
  librariesButton.style.cursor = 'not-allowed';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getRepositoryButtonDiv() {
  const elements = document.body.querySelectorAll(
    "ul[class='UnderlineNav-body list-style-none']"
  );
  if (elements.length == 1) {
    return elements[0] as HTMLDivElement;
  } else if (elements.length > 1) {
    console.warn('Found more than one Repository Button Div');
    return elements[0] as HTMLDivElement;
  } else {
    console.warn('Could not find Repository Button Div');
    return undefined;
  }
}
