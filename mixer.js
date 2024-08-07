var control = 0;
var myAudioContext, gain_node, pan_node, low_eq_node, file_1, track_1, play_button, maximo, progreso, bucle, tiempo_actual, tiempo_total, pan_ch1, volumen_ch1;
var low_eq_node, eq_ch1_lf, hf_eq_node, eq_ch1_hf, mb_eq_node, eq_ch1_mf, mute_button_ch1;


function iniciar(){
    maximo = 120;
    myAudioContext = new AudioContext();
    gain_node = myAudioContext.createGain();
    pan_node = myAudioContext.createStereoPanner();
    low_eq_node = myAudioContext.createBiquadFilter();
    hf_eq_node = myAudioContext.createBiquadFilter();
    mb_eq_node = myAudioContext.createBiquadFilter();

    file_1 = document.getElementById("file-ch1");
    track_1 = myAudioContext.createMediaElementSource(file_1);
    track_1.connect(gain_node).connect(pan_node).connect(low_eq_node).connect(mb_eq_node).connect(hf_eq_node).connect(myAudioContext.destination); 

    low_eq_node.type = "lowshelf";
    low_eq_node.frequency.value = 100;
    mb_eq_node.type = "peaking";
    mb_eq_node.Q.value = 1;
    mb_eq_node.frequency.value = 2500;
    hf_eq_node.type = "highshelf";
    hf_eq_node.frequency.value = 10000;
    
    progreso = document.getElementById("progress-bar");
    tiempo_actual = document.getElementById("current-time");
    tiempo_total = document.getElementById("duration");
    play_button = document.getElementById("play-button");
    mute_button_ch1 = document.getElementById("mute-button-ch1");
    pan_ch1 = document.getElementById("pan-ch1");
    eq_ch1_lf = document.getElementById("eq-ch1-lf");
    eq_ch1_mf = document.getElementById("eq-ch1-mf");
    eq_ch1_hf = document.getElementById("eq-ch1-hf");
    volumen_ch1 = document.getElementById("fader-ch1");
    play_button.addEventListener("click", reproducir);
    mute_button_ch1.addEventListener("click", function(evento){
        control += 1;
        mutear(evento, control);
    });
    pan_ch1.addEventListener("change", panear);
    eq_ch1_lf.addEventListener("change", low_eq);
    eq_ch1_mf.addEventListener("change", mf_eq);
    eq_ch1_hf.addEventListener("change", hi_eq);
    volumen_ch1.addEventListener("change", volumen);
}

function reproducir(){
    if(myAudioContext.state == "suspended"){
        myAudioContext.resume();
    }
    if(!file_1.paused && !file_1.ended){
        play_button.innerHTML = ">";
        file_1.pause();
        clearInterval(bucle);
    }else{
        play_button.innerHTML = "||";
        file_1.play();
        bucle = setInterval(estado, 1000);
    }
}

function estado(){
    if(!file_1.ended){
        var largo = parseInt((file_1.currentTime * maximo) / file_1.duration);
        progreso.style.width = largo + "px";
        tiempo_actual.innerHTML = parseInt(file_1.currentTime);
        tiempo_total.innerHTML = parseInt(file_1.duration);
    } else {
        progreso.style.width = "0px";
        tiempo_total.innerHTML = parseInt(file_1.duration);
        clearInterval(bucle);
    }
}

function panear(){
    pan_node.pan.value = pan_ch1.value;
}

function low_eq(){
    low_eq_node.gain.value = eq_ch1_lf.value;
}

function mf_eq(){
    mb_eq_node.gain.value = eq_ch1_mf.value;
}

function hi_eq(){
    hf_eq_node.gain.value = eq_ch1_hf.value;
}

function volumen(){
    gain_node.gain.value = volumen_ch1.value;
}

function mutear(evento, control){
    if((control % 2) == 0){
        gain_node.gain.value = volumen_ch1.value;
    } else {
        gain_node.gain.value = 0;
    }
}

window.addEventListener("load", iniciar);