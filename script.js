const countdownForm = document.getElementById('countdownForm');
const inputContainer = document.getElementById('input-container');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

let countdownTitle= '';
let countdownDate= '';
let countdownValue= Date();
let countdownActive;
let savedCountdown; //this will be used for caching



//set date input min with Todays date
// const today = new Date().toLocaleString("en-US", {timeZone: "Africa/Nairobi"}).split(',')[0];
const today = new Date().toISOString({timeZone: "Africa/Nairobi"}).split('T')[0];
dateEl.setAttribute('min', today);
console.log(today);
console.log(dateEl);

//populate countdown / complete UI
function updateDOM(){
  countdownActive = setInterval(() => {
    
    
       const now = new Date().getTime();
       const distance = countdownValue - now;
       console.log('now :' , now );
       console.log('distance', distance);

       const days = Math.floor(distance / day)
       const hours = Math.floor((distance % day) / hour);
       const minutes = Math.floor((distance % hour) / minute );
       const seconds = Math.floor((distance % minute) / second );
       console.log(days, hours, minutes, seconds);

       //hide input
       inputContainer.hidden= true;

       //if countdown has ended show compete
       if (distance <0){
        countdownEl.hidden = true;
        completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`
        completeEl.hidden = false;

       }else {
        //show countdown in progress
        countdownElTitle.textContent = `${countdownTitle}`
        timeElements[0].textContent = `${days}` 
        timeElements[1].textContent = `${hours}` 
        timeElements[2].textContent = `${minutes}` 
        timeElements[3].textContent = `${seconds}`
        countdownEl.hidden = false; 
        completeEl.hidden = true;
       }

  }, second);

}
//take values from form input 
function updateCountdown(e){
  e.preventDefault();
  countdownTitle= e.srcElement[0].value;
  countdownDate= e.srcElement[1].value;
  console.log(countdownTitle, countdownDate);

  savedCountdown= {
    title: countdownTitle,
    date: countdownDate,
  };
  console.log(savedCountdown);
  localStorage.setItem('countdown' , JSON.stringify(savedCountdown));

  if (countdownDate==''){
      alert('wtf bruh...input date')
      
  } else{
    // get number version of current Date, updateDom
    countdownValue= new Date(countdownDate).getTime(); //get time() returns time from 1997 to specified date
    console.log('countdown value:', countdownValue);
    updateDOM();
  }


}
//reset all values
function reset(){
  //show input
  inputContainer.hidden= false;

  //hide complete element
  completeEl.hidden = true;

  //hide countdown
  countdownEl.hidden = true;

  //stop the countdown
  clearInterval(countdownActive)

  //reset values
  countdownTitle= '';
  countdownDate= '';
  localStorage.removeItem('countdown');

}

function restorePreviousCountdown(){
  //get countdown from localstorage if available
  if(localStorage.getItem('countdown')){
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}


//event listeners
countdownForm.addEventListener('submit', updateCountdown); //this targets a submit button
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

//check local storage onload
restorePreviousCountdown();