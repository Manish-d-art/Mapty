'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



class workOut{
    date=new Date();
    id=(new Date()+ '').slice(-10);

    constructor(coords,distance,duration){
        this.coords=coords;// [lat,lng]
        this.distance=distance;//in km
        this.duration=duration;//in min
    }
}

class Running extends workOut{
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration);
        this.cadence=cadence;
        this.calcPace();
    }

    calcPace(){
        this.pace=this.duration/this.distance;
        return this.pace;
    }
}

class Cycling extends workOut{
    constructor(coords,distance,duration,elevationGain){
        super(coords,distance,duration);
        this.elevationGain=elevationGain;
    }

    calcSpeed(){
        this.speed=this.distance/this.duration/60;
        return this.speed;
    }
}

// const run1=new Running([39,-12],5.2,24,178);
// const cycling1=new Cycling([39,-12],27,95,523);
// console.log(run1,cycling1);


//////////////////////////////

//Application Architecture
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkOut.bind(this));

    inputType.addEventListener('change',this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //handling click on map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation .closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkOut(e) {
    e.preventDefault();

    const validInputs= (...inputs) =>
    inputs.every(inp=>isFinite(inp));

    const allPositive= (...inputs) => inputs.every(inp => inp >0);
    
    //get data fom form
    const type=inputType.value;
    const distance= +inputDistance.value;
    const duration= +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;

    //if workout running, create running object
    if(type==='running'){
        const cadence= +inputCadence.value;
        //check if data is valid
        if(!validInputs(distance,duration,cadence) || !allPositive(distance,duration,cadence)){
            return alert('Inputs have to be positive numbers!');
        }
      const workOut=new Running([lat,lng],distance,duration,cadence);
    }


    //if workout cycling, create cycling object
    if(type==='cycling'){
            const elevation= +inputElevation.value;
            //check if data is valid
            if(!validInputs(distance,duration,elevation) || !allPositive(distance,duration)){
                return alert('Inputs have to be positive numbers!');
            }
        }
   
    //add new object to workout array

    //Render workout on map as marker
    
    console.log(lat, lng);
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
    //Render workout on list

    //hide form + clear input fields

    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';

   
  }
}

//object of class
const app = new App();
