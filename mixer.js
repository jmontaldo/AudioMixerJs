var channel_1 = [];
var channel_2 = [];
var channel_3 = [];
var channel_4 = [];
var channel_5 = [];
var control = 0;
var progreso, bucle, tiempo_actual, tiempo_total, play_button, myAudioContext;
var file_1, track_1, pan_ch, eq_ch_lf, eq_ch_hf, eq_ch_mf, mute_button_ch, volumen_ch;
var file_2, track_2, file_3, track_3, file_4, track_4, file_5, track_5;

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
    pan_ch = document.getElementsByName("pan-ch");
    eq_ch_lf = document.getElementsByName("eq-ch-lf");
    eq_ch_mf = document.getElementsByName("eq-ch-mf");
    eq_ch_hf = document.getElementsByName("eq-ch-hf");
    volumen_ch = document.getElementsByName("fader-ch");
    mute_button_ch = document.getElementsByName("mute-button");
    for(var i = 0; i < pan_ch.length; i++){
        pan_ch[i].addEventListener("change", panear);
        eq_ch_lf[i].addEventListener("change", low_eq);
        eq_ch_mf[i].addEventListener("change", mf_eq);
        eq_ch_hf[i].addEventListener("change", hi_eq);
        volumen_ch[i].addEventListener("change", volumen);
        mute_button_ch[i].addEventListener("click", function(evento){
            control += 1;
            mutear(evento, control);
        });
    }
    // CHANNEL 2
    channel_2 = channel(myAudioContext);
    file_2 = document.getElementById("file-ch2");
    track_2 = myAudioContext.createMediaElementSource(file_2);
    track_2.connect(channel_2[0]).connect(channel_2[1]).connect(channel_2[2]).connect(channel_2[3]).connect(channel_2[4]).connect(myAudioContext.destination);
    // CHANNEL 3
    channel_3 = channel(myAudioContext);
    file_3 = document.getElementById("file-ch3");
    track_3 = myAudioContext.createMediaElementSource(file_3);
    track_3.connect(channel_3[0]).connect(channel_3[1]).connect(channel_3[2]).connect(channel_3[3]).connect(channel_3[4]).connect(myAudioContext.destination);
    // CHANNEL 4
    channel_4 = channel(myAudioContext);
    file_4 = document.getElementById("file-ch4");
    track_4 = myAudioContext.createMediaElementSource(file_4);
    track_4.connect(channel_4[0]).connect(channel_4[1]).connect(channel_4[2]).connect(channel_4[3]).connect(channel_4[4]).connect(myAudioContext.destination);
    // CHANNEL 5
    channel_5 = channel(myAudioContext);
    file_5 = document.getElementById("file-ch5");
    track_5 = myAudioContext.createMediaElementSource(file_5);
    track_5.connect(channel_5[0]).connect(channel_5[1]).connect(channel_5[2]).connect(channel_5[3]).connect(channel_5[4]).connect(myAudioContext.destination);
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
        file_3.pause();
        file_4.pause();
        file_5.pause();
        clearInterval(bucle);
    }else{
        play_button.innerHTML = "||";
        file_1.play();
        file_2.play();
        file_3.play();
        file_4.play();
        file_5.play();
        bucle = setInterval(estado, 1000);
    }
}

function estado(){
    var maximo = 120;
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

function volumen(evento){
    if(evento.target.id == "fader-ch1"){
        channel_1[0].gain.value = volumen_ch[0].value;
    } else if (evento.target.id == "fader-ch2") {
        channel_2[0].gain.value = volumen_ch[1].value;
    } else if (evento.target.id == "fader-ch3"){
        channel_3[0].gain.value = volumen_ch[2].value;
    } else if (evento.target.id == "fader-ch4"){
        channel_4[0].gain.value = volumen_ch[3].value;
    } else {
        channel_5[0].gain.value = volumen_ch[4].value;
    }
    
}

function panear(evento){
    if(evento.target.id == "pan-ch1"){
        channel_1[1].pan.value = pan_ch[0].value;
    } else if (evento.target.id == "pan-ch2"){
        channel_2[1].pan.value = pan_ch[1].value;
    } else if (evento.target.id == "pan-ch3"){
        channel_3[1].pan.value = pan_ch[2].value;
    } else if (evento.target.id == "pan-ch4"){
        channel_4[1].pan.value = pan_ch[3].value;
    } else{
        channel_5[1].pan.value = pan_ch[4].value;
    }
}

function low_eq(evento){
    if(evento.target.id == "eq-ch1-lf"){
        channel_1[2].gain.value = eq_ch_lf[0].value;
    } else if (evento.target.id == "eq-ch2-lf"){
        channel_2[2].gain.value = eq_ch_lf[1].value;
    } else if (evento.target.id == "eq-ch3-lf"){
        channel_3[2].gain.value = eq_ch_lf[2].value;
    } else if (evento.target.id == "eq-ch4-lf"){
        channel_4[2].gain.value = eq_ch_lf[3].value;
    } else {
        channel_4[2].gain.value = eq_ch_lf[4].value;
    }
}

function mf_eq(evento){
    if(evento.target.id == "eq-ch1-mf"){
        channel_1[3].gain.value = eq_ch_mf[0].value;
    } else if (evento.target.id == "eq-ch2-mf"){
        channel_2[3].gain.value = eq_ch_mf[1].value;
    } else if (evento.target.id == "eq-ch3-mf"){
        channel_3[3].gain.value = eq_ch_mf[2].value;
    } else if (evento.target.id == "eq-ch4-mf"){
        channel_4[3].gain.value = eq_ch_mf[3].value;
    } else {
        channel_5[3].gain.value = eq_ch_mf[4].value;
    }
    
}

function hi_eq(evento){
    if(evento.target.id == "eq-ch1-hf"){
        channel_1[4].gain.value = eq_ch_hf[0].value;
    } else if (evento.target.id == "eq-ch2-hf"){
        channel_2[4].gain.value = eq_ch_hf[1].value;
    } else if (evento.target.id == "eq-ch3-hf"){
        channel_3[4].gain.value = eq_ch_hf[2].value;
    } else if (evento.target.id == "eq-ch4-hf"){
        channel_4[4].gain.value = eq_ch_hf[3].value;
    } else {
        channel_5[4].gain.value = eq_ch_hf[4].value;
    }
}

function mutear(evento, control){
    if(((control % 2) == 0) && (evento.target.id == "mute-button-ch1")){
        channel_1[0].gain.value = volumen_ch[0].value;
    } else if (((control % 2) == 0) && (evento.target.id == "mute-button-ch2")){
        channel_2[0].gain.value = volumen_ch[1].value;
    } else if (((control % 2) == 0) && (evento.target.id == "mute-button-ch3")){
        channel_3[0].gain.value = volumen_ch[2].value;
    } else if (((control % 2) == 0) && (evento.target.id == "mute-button-ch4")){
        channel_4[0].gain.value = volumen_ch[3].value;
    } else if (((control % 2) == 0) && (evento.target.id == "mute-button-ch5")){
        channel_5[0].gain.value = volumen_ch[4].value;
    } else if (((control % 2) != 0) && (evento.target.id == "mute-button-ch1")){
        channel_1[0].gain.value = 0;
    } else if (((control % 2) != 0) && (evento.target.id == "mute-button-ch2")){
        channel_2[0].gain.value = 0;
    } else if (((control % 2) != 0) && (evento.target.id == "mute-button-ch3")){
        channel_3[0].gain.value = 0;
    } else if (((control % 2) != 0) && (evento.target.id == "mute-button-ch4")){
        channel_4[0].gain.value = 0;
    } else {
        channel_5[0].gain.value = 0;
    }
}

window.addEventListener("load", iniciar);