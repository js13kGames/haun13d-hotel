### Game Design Document (GDD) Draft: **Ghost Buster on the 13th Floor**

#### 1. **Game Overview**

**Title**: Ghost Buster on the 13th Floor

**Genre**: Action, Survival

**Platform**: WebXR

**Description**: The player takes on the role of a ghost buster tasked with cleansing an endless stream of ghosts haunting the 13th floor of a hotel. The goal is to survive and clear as many rooms as possible by capturing ghosts while the difficulty progressively increases over time.

#### 2. **Gameplay Mechanics**

##### 2.1 **Core Mechanics**

- **Movement**: RoomScale. The player is standing in 1 spot. The player can walk IRL and move a bit.
- **Ghost Busting**: The player uses a proton gun to capture ghosts.

##### 2.2 **Progressive Difficulty**

- **Increasing Ghost Numbers**: The number of ghosts increases gradually as the player progresses.
- **Ghost Variety**: Introduce different types of ghosts with unique behaviors and abilities. Since it's 13K this might only be color or texture

#### 3. **Game Flow**

##### 3.1 **Initial Setup**

- The player starts in the hallway of the 13th floor, equipped with ghost-busting gear.
- The first room is unlocked and the player must enter and clear it of ghosts.

##### 3.2 **Room Clearing**

- **Ghost Capture**: The player uses their equipment to capture ghosts.

##### 3.3 **Progression**

- After clearing a room, the next room unlocks, and the difficulty increases.
- The game continues in an endless loop with progressively harder challenges.

#### 4. **Game Elements**

##### 4.1 **Player Abilities**

- **Proton Pack**: Main tool for capturing or eliminating ghosts.
- **Voice Commands**: Specific commands can be used to interact with the environment (e.g., "Reveal" to show hidden ghosts).

##### 4.2 **Ghost Types**

1. **Basic Ghost**: Slow-moving, easy to capture.
2. **Fast Ghost**: Moves quickly, harder to target.
3. **Hiding Ghost**: Disappears and reappears, requiring careful tracking.
4. **Aggressive Ghost**: Actively attacks the player, causing distractions or damage.

##### 4.3 **Environmental Interactions**

- **Flickering Lights**: Indicate ghost presence.
- **Moving Objects**: Objects that can move or be thrown by ghosts.
- **Sound Cues**: Audio hints to indicate nearby ghosts or environmental changes.

#### 5. **User Interface**

##### 5.1 **Heads-Up Display (HUD)**

- **Health Meter**: Indicates player health.
- **Ghost Radar**: Shows ghost positions and alerts the player to their presence.
- **Proton Pack Charge**: Displays remaining charge or cooldown for the proton pack.

#### 6. **Controls**

##### 6.1 **VR Controls**

- **Movement**: Room Scale
- **Proton Pack**: Trigger buttons to activate and aim.

#### 7. **Difficulty Scaling**

##### 7.1 **Time-Based Scaling**

- Increase the number of ghosts spawning over time.
- Decrease the cooldown for ghost spawns.

##### 7.2 **Room-Based Scaling**

- Each successive room introduces new challenges or ghost types.
- Environmental changes become more frequent and impactful.

##### 7.3 **Random Events**

- Randomly triggered events such as lights flickering, objects moving, or sudden ghost appearances.

#### 8. **Audio and Visual Design**

##### 8.1 **Audio Design**

- Very simple sounds, since it's max 13KB.
- **Ambient Sounds**: Creepy background sounds to set the mood.

##### 8.2 **Visual Design**

- **Room Themes**: Each room on the 13th floor has a unique theme and layout.
- **Ghost Effects**: Visual effects for ghost appearances, captures, and environmental interactions.

#### 9. **Technical Requirements**

##### 9.1 **Performance Optimization**

- Optimize assets and code to fit within the 13KB limit.
- Textures are build with Phoboslab TTT. <https://phoboslab.org/ttt/>

##### 9.2 **Testing and Debugging**

- Rigorous testing to ensure smooth VR performance and responsive controls.
- Debugging to address any issues with microphone input and voice commands.

#### 10. **Future Enhancements**

- **Multiplayer Mode**: Co-op gameplay with multiple players clearing rooms together.
- **New Ghost Types**: Regular updates introducing new ghosts with unique abilities.
- **Additional Equipment**: Unlockable or upgradable ghost-busting tools.
