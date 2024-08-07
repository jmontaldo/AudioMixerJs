var channel_1 = [];
var channel_2 = [];
var control = 0;
var maximo = 120;
var maximo, progreso, bucle, tiempo_actual, tiempo_total, play_button, myAudioContext;
var file_1, track_1, eq_ch1_lf, eq_ch1_hf, eq_ch1_mf, mute_button_ch1, pan_ch1, volumen_ch1;
var file_2, track_2, pan_ch2;

function iniciar(){
    // REPRODUCTOR
    progreso = document.getElementById("progress-bar");
    tiempo_actual = document.getElementById("current-time");
    tiempo_total = document.getElementById("duration");
    play_button = document.getElementById("play-button");
    play_button.addEventListener("click", reproducir);
    // CHANNEL 1
    myAudioContext = new AudioContext();
    channel_1 = channel(myAudioContext);
    file_1 = document.getElementById("file-ch1");
    track_1 = myAudioContext.createMediaElementSource(file_1);
    track_1.connect(channel_1[0]).connect(channel_1[1]).connect(channel_1[2]).connect(channel_1[3]).connect(channel_1[4]).connect(myAudioContext.destination); 
    mute_button_ch1 = document.getElementById("mute-button-ch1");
    pan_ch1 = document.getElementById("pan-ch1");
    eq_ch1_lf = document.getElementById("eq-ch1-lf");
    eq_ch1_mf = document.getElementById("eq-ch1-mf");
    eq_ch1_hf = document.getElementById("eq-ch1-hf");
    volumen_ch1 = document.getElementById("fader-ch1");
    mute_button_ch1.addEventListener("click", function(evento){
        control += 1;
        mutear(evento, control);
    });
    pan_ch1.addEventListener("change", panear);
    eq_ch1_lf.addEventListener("change", low_eq);
    eq_ch1_mf.addEventListener("change", mf_eq);
    eq_ch1_hf.addEventListener("change", hi_eq);
    volumen_ch1.addEventListener("change", volumen);
    // CHANNEL 2
    channel_2 = channel(myAudioContext);
    file_2 = document.getElementById("file-ch2");
    track_2 = myAudioContext.createMediaElementSource(file_2);
    track_2.connect(channel_2[0]).connect(channel_2[1]).connect(channel_2[2]).connect(channel_2[3]).connect(channel_2[4]).connect(myAudioContext.destination);
    pan_ch2 = document.getElementById("pan-ch2");
    pan_ch2.addEventListener("change", panear);
}

function channel(myAudioContext){
    var channel_array = [];
    var gain_node = myAudioContext.createGain();
    var pan_node = myAudioContext.createStereoPanner();
    var low_eq_node = myAudioContext.createBiquadFilter();
    var hf_eq_node = myAudioContext.createBiquadFilter();
    var mb_eq_node = myAudioContext.createBiquadFilter();
    low_eq_node.type = "lowshelf";
    low_eq_node.frequency.value = 100;
    mb_eq_node.type = "peaking";
    mb_eq_node.Q.value = 1;
    mb_eq_node.frequency.value = 2500;
    hf_eq_node.type = "highshelf";
    hf_eq_node.frequency.value = 10000;
    channel_array = [gain_node, pan_node, low_eq_node, mb_eq_node, hf_eq_node];
    return channel_array;
}

function reproducir(){
    if(myAudioContext.state == "suspended"){
        myAudioContext.resume();
    }
    if(!file_1.paused && !file_1.ended){
        play_button.innerHTML = ">";
        file_1.pause();
        file_2.pause();
        clearInterval(bucle);
    }else{
        play_button.innerHTML = "||";
        file_1.play();
        file_2.play();
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

function volumen(){
    channel_1[0].gain.value = volumen_ch1.value;
}

function panear(evento){
    if(evento.target.id == "pan-ch1"){
        channel_1[1].pan.value = pan_ch1.value;
    } else {
        channel_2[1].pan.value = pan_ch2.value;
    }
}

function low_eq(){
    channel_1[2].gain.value = eq_ch1_lf.value;
}

function mf_eq(){
    channel_1[3].gain.value = eq_ch1_mf.value;
}

function hi_eq(){
    channel_1[4].gain.value = eq_ch1_hf.value;
}

function mutear(evento, control){
    if((control % 2) == 0){
        channel_1[0].gain.value = volumen_ch1.value;
    } else {
        channel_1[0].gain.value = 0;
    }
}

window.addEventListener("load", iniciar);