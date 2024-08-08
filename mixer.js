var channel_1 = [];
var channel_2 = [];
var control = 0;
var maximo = 120;
var progreso, bucle, tiempo_actual, tiempo_total, play_button, myAudioContext;
var file_1, track_1, pan_ch, eq_ch_lf, eq_ch_hf, eq_ch_mf, mute_button_ch, volumen_ch;
var file_2, track_2;

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
    /*mute_button_ch.addEventListener("click", function(evento){
        control += 1;
        mutear(evento, control);
    });*/
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

function volumen(evento){
    console.log(evento.target.id);
    if(evento.target.id == "fader-ch1"){
        channel_1[0].gain.value = volumen_ch[0].value;
    } else {
        channel_2[0].gain.value = volumen_ch[1].value;
    }
    
}

function panear(evento){
    console.log(evento.target.id);
    if(evento.target.id == "pan-ch1"){
        channel_1[1].pan.value = pan_ch[0].value;
    } else {
        channel_2[1].pan.value = pan_ch[1].value;
    }
}

function low_eq(evento){
    if(evento.target.id == "eq-ch1-lf"){
        channel_1[2].gain.value = eq_ch_lf[0].value;
    } else {
        channel_2[2].gain.value = eq_ch_lf[1].value;
    }
}

function mf_eq(evento){
    if(evento.target.id == "eq-ch1-mf"){
        channel_1[3].gain.value = eq_ch_mf[0].value;
    } else {
        channel_2[3].gain.value = eq_ch_mf[1].value;
    }
    
}

function hi_eq(evento){
    if(evento.target.id == "eq-ch1-hf"){
        channel_1[4].gain.value = eq_ch_hf[0].value;
    } else {
        channel_2[4].gain.value = eq_ch_hf[1].value;
    }
}

function mutear(evento, control){
    if(((control % 2) == 0) && (evento.target.id == "mute-button-ch1")){
        channel_1[0].gain.value = volumen_ch[0].value;
    } else if (((control % 2) == 0) && (evento.target.id == "mute-button-ch2")){
        channel_2[0].gain.value = volumen_ch[1].value;
    } else if (((control % 2) != 0) && (evento.target.id == "mute-button-ch1")){
        channel_1[0].gain.value = 0;
    } else {
        channel_2[0].gain.value = 0;
    }
}

window.addEventListener("load", iniciar);