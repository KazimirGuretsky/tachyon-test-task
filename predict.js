const howItWorks = document.getElementById("how-it-works");
const modalWrapper = document.querySelector(".predict-wrapper");
const modalClose = document.querySelector(".predict-modal__close");
const submitForm = document.getElementById("submit_predict");
const image = document.querySelector(".predict-modal__result-img img");
const form = document.forms.predict;
const formInputs = document.querySelectorAll("#predict-form input");

window.onload = () =>{
  if (localStorage.getItem('predicts')<=1){
    noMoreAttempts();
  }
}

localStorage.setItem('predicts',localStorage.getItem('predicts')?localStorage.getItem('predicts'):3)

const testReg = (val, i) => {
  const RE = [/^([0-9]*[.,]?[0-9]+\s?)+$/gm, /^\d+$/];
  return RE[i].test(val);
};

howItWorks.addEventListener("click", switchModal);
modalClose.addEventListener("click", switchModal);

submitForm.addEventListener("click", sendForm);

function switchModal(e) {
  modalWrapper.classList.toggle("disabled");
  if (e.target == modalClose) {
    form.reset();
    if(document.querySelector('.input-error')){
      document.querySelectorAll('.input-error').forEach((item)=>{
        item.classList.remove('input-error');
      })
    }
    image.src = './assets/empty-box.png';
  }
}

function sendForm(e) {
  e.preventDefault();
  let check = checkRequest();
  if (check) {
    predictRequest();
  } else {
    alert('Check form');
  }
}

function checkRequest() {
  let percentage = form.percentage_points;
  let points = form.points_to_predict;
  let percentageResult = testReg(percentage.value, 0);
  let pointsResult = testReg(points.value, 1);

  checkRequestStyle(percentage, percentageResult);
  checkRequestStyle(points, pointsResult);

  return percentageResult && pointsResult;
}

function checkRequestStyle(input, check) {
  if (!check) {
    input.classList.add('input-error')
  } else {
    input.classList.remove('input-error')
  }
}

async function predictRequest(e) {
  image.src = "./assets/loading.gif";
  let response = await fetch("https://api.tachyon-analytics.com/predict/", {
    method: "POST",
    body: new FormData(form),
  });
  if (!response.ok) {
    image.src = "./assets/error.png";
  }else{
    if (localStorage.getItem('predicts')>1){
      localStorage.setItem('predicts', localStorage.getItem('predicts')-1);
    }else{
      noMoreAttempts();
    }
  }
  let result = await response.json();
  showPredictResult(result.url);
}

function showPredictResult(url) {
  image.src = `https://api.tachyon-analytics.com/predict/${url}`;
}

function noMoreAttempts(){
  formInputs.forEach((input)=>{
    input.setAttribute("disabled", "disabled")
  })
  let info = document.createElement("p");
  info.innerHTML="Contact us to get more predictions";
  info.style.fontSize="1.5em";
  info.style.fontWeight="bold";
  info.style.color="#006400"
  form.prepend(info)
}
