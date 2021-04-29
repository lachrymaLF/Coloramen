# Coloramen

Adobe After Effects CEP helper panel for the clunky Colorama effect

Here is a diagram explaining the .ffx data stored for Colorama

![Explanation of Colorama data](https://i.imgur.com/U0D5Q5h.png)

[Detailed discussion on Adobe Community](https://community.adobe.com/t5/after-effects/change-colorama-colors-via-scripting/m-p/10392133)

Where the section of keys begin and end, and where the total number of keys is stored seem to differ from setup to setup. For the *template.ffx* provided in this repository, the keys starts on 0CD0 and the byte containing the number of keys is stored in 0ED3.

### ID Labels of the effect (As of CC 2021 12.0.0, Colorama v1.1)

![Labels of Colorama](https://i.imgur.com/TLkFsAq.png)

(not yet) Achieved through hex .ffx manipulation

Thanks to [Belonit/AEColorPicker](https://github.com/Belonit/AEColorPicker) 
