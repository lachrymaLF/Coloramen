# Coloramen

Adobe After Effects CEP helper panel for the clunky Colorama effect

![GIF Demo](https://user-images.githubusercontent.com/13716477/116627160-980a7c80-a91a-11eb-9423-60a6f77192c9.gif)

Achieved through direct manipulation of the animation preset binary

### Caveats
- The data in [Source / Masks / Effects & Masks] option will not be saved
- Keyframes and expressions are not saved

### How it works
Here is a diagram explaining the .ffx data stored for Colorama

![Explanation of Colorama data](https://i.imgur.com/U0D5Q5h.png)

[Detailed discussion on Adobe Community](https://community.adobe.com/t5/after-effects/change-colorama-colors-via-scripting/m-p/10392133)

Where the section of keys begin and end, and where the total number of keys is stored seem to differ from setup to setup. For the *template.ffx* provided in this repository, the keys starts on 2D1C and the byte containing the number of keys is stored in 2F1F.
It also seems that the same data repeats once at 0CD0 and 0ED3 (keys and # of keys, respectively), but they do not seem to matter when the .ffx is applied.

### ID Labels of the effect (As of CC 2021 12.0.0, Colorama v1.1)

![Labels of Colorama](https://i.imgur.com/TLkFsAq.png)

- Massive thanks to [Belonit/AEColorPicker](https://github.com/Belonit/AEColorPicker)
