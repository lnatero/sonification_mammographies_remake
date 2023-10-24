import("stdfaust.lib");
// ctFreq = 500;
q = 5;
// gain =1;
// process = no.noise : _ <: fi.resonlp(ctFreq,q,gain), fi.resonlp(3*ctFreq,2,0.5);
// volumen, "wetness"(?), frecuencia, tempo

mean = hslider("vol", 0, 0, 1, 0.01);
std = hslider("noise", 0.5, 0, 1, 0.01);
skw = hslider("freq", 0.5, 0, 1, 0.01)*1000;
kur = hslider("tempo", 0.5, 0, 1, 0.01)*10;
mute = hslider("mute", 0, 0, 1, 1);
envelope = vgroup("test", mute, mean, std, skw, kur);
process = vgroup("audiogen", (os.osc(skw)*os.lf_saw(kur)+no.noise*std)*mean* mute: si.smoo);
// process = (envelope: ba.automat(tempo*60, 10, 0.0));
