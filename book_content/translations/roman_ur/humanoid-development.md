---
sidebar_position: 1
title: Humanoid Development
description: >
  Comprehensive guide to humanoid robot engineering: kinematics, balance control,
  manipulation, human-robot interaction, hardware selection, lab budget planning,
  and deployment strategies for educational and research environments.
keywords:
  - humanoid robot
  - bipedal locomotion
  - forward kinematics
  - inverse kinematics
  - center of mass
  - gait planning
  - force control
  - URDF
  - ROS 2
  - humanoid hardware
  - Unitree G1
  - Unitree H1
  - Robotis OP3
  - Hiwonder TonyPi
  - social robotics
  - proxemics
  - grasp planning
  - balance control
  - zero moment point
  - lab budget
---

import PersonalizationToolbar from '@site/src/components/Personalization/PersonalizationToolbar';

# Humanoid Development

<PersonalizationToolbar chapterSlug="humanoids/humanoid-development" />

## Seekhne ke nataij

Is bab ke ikhtitam par, aap yeh kar sakenge:

- Humanoid robots ke liye do paon ki chaal, majmooi manipulation, aur real-time balance control mein ahem engineering challenges ki shanakht karein.
- Multi-DOF mushtariha systems ke liye forward kinematics, inverse kinematics, aur Jacobian par mabni control ki wazahat karein.
- Center of mass trajectories ka hisaab lagayein aur static aur dynamic stability criteria ka jaiza lein bashamol zero moment point (ZMP) aur capture point.
- Chalne, bhaagne, seedhi chadhne, aur zameen ke dhanchay ke munasib ke liye gait patterns design aur muwazna karein.
- Humanoid hands ke saath dexterous manipulation ke liye force aur torque control hikmat-e-amaliyon ko lagu karein.
- Proxemics, gesture, aur intent communication samait social robotics ke usoolon ko insaan-robot interaction par lagu karein.
- Humanoid hardware platforms (Unitree G1, H1, Go2, Robotis OP3, Hiwonder TonyPi) ka compute, actuators, sensors, payload, aur qeemat ke lihaaz se muwazna karein.
- Ek staged lab hikmat-e-amali banayein jo sirf simulation se lekar mukammal humanoid deployment tak haqeeqi budget aur hifazat ki pabandiyon ke andar phailti hai.

## Tasawwur ki wazahat

### Kyun humanoid form factors ahem hain

Humanoid robots us mahol ke liye engineer kiye gaye hain jo logon ke ird gird banaye gaye hain. Darwaze, seedhiyan, mezein, tool ke handles, shelf, aur kitchen ke aala sab insaan jismani manzooray ko samajhte hain: ek khada dhad, do mushtariha baazu jin mein haath hain, do tangein jin mein ghutne aur koolhay ke jore hain, aur ek sir jis mein cameras aur microphones hote hain. Yeh shakli ta'alluq ka matlab hai ke ek humanoid usooli taur par wohi tools istemal kar sakta hai, wohi rastein par chal sakta hai, aur wohi interfaces ke saath interact kar sakta hai jaise ek insaan operator karta hai. Yeh humanoid form factor ka markazi qaeda hai: insaani jagahon mein tanasukh mahol ki tameem ki zaroorat ko kam karta hai.

Taham, yeh shakli faida bohot bari control laqat ke saath aata hai. Ek humanoid jis mein 28 degrees of freedom (DOF) hain, ko 28 actuators ko ek saath coordinate karna hota hai jabke chhote support polygon par do paon par mutaharik tawazun barqarar rakhna hota hai. Chhoti ghalatiyan ghair linear taur par jama hoti hain: 5 millimeter ki paon ki positioning ki ghalati center of mass ko mutaharik karti hai, jo dhad ko ghair mustahkam karti hai, jo baazun ko balance ke liye jhoola jhulne par majboor karti hai, jo kisi bhi jaari manipulation ke kaam ko mutasir karti hai. Subsystems ke darmiyaan ka tie humanoid robotics ko applied control theory mein sab se mushkil masail mein se ek bana deta hai.

### Control stack

Ek humanoid control stack tehon mein munazzam hota hai, har teh mukhtalif frequency aur tajarrud satah par kaam karti hai:

1. **Joint level torque control** (1 kHz): Har actuator ko PID ya impedance controller ki bunyaad par torque command milti hai. Yeh teh oonche satah ki hifazat ki hadood, current saturation, aur backlash compensation ko sambhalti hai.
2. **Majmooi control** (500 Hz): Ek quadratic program ya operational space controller makhsoos end-effector forces aur torques ko tamam joints mein taqseem karta hai jabke friction cones, torque limits, aur balance constraints ki pabandi karta hai.
3. **Motion planning** (50-100 Hz): Ek planner paon ke qadam, baazun ki rasaai, aur dhad ki dobara samt banayed ke liye qabil-e-amal trajectories banata hai. Yeh preview control ya Model Predictive Control (MPC) istemal karta hai taake mustaqbil ke qadmon ka andaza lagaya ja sakay.
4. **Perception** (10-30 Hz): Depth cameras, lidar, aur tactile sensors ek state estimator ko feed karte hain jo robot ko maqami banata hai, rukawaton ki shanakht karta hai, aur manzar mein insaanon ko track karta hai.
5. **Task level reasoning** (1-10 Hz): Ek oonche satah ka planner ya seekha hua policy kaam intekhab karta hai, wasail taqseem karta hai, aur naakaamiyon aur dobara koshishon ko sambhalta hai.

### Ahem engineering challenges

| Challenge | Kyun mushkil hai | Naakaami ka tareeqa |
|---|---|---|
| Dynamic balance | Support polygon chhota hai; robot hamesha hissoi taur par gir raha hota hai | Girna, hardware ko nuqsan |
| Contact transitions | Paon-zameen contact hybrid hai (discrete + musalsal) | Thokar khana, phisalna |
| Majmooi humahangi | 20+ DOF balance aur momentum ke zariye tie gaye hain | Kaam mein naakaami, dahalna |
| Motion ke tehat perception | Camera ki tasaveer jism ki hirakt se dhundhli aur mutaharik hoti hain | Maqami banane mein ghalati |
| Battery life | Zyada taaqat wale actuators batteryon ko minton mein khatam kar dete hain | Mission timeout |
| Payload bampaabta weight | Zyada payload ke liye bade actuators chahiye, jo wazn barhate hain | Mobility mein kami |
| Insanon ke saath hifazat | Sakht links aur zyada torque wale actuators logon ko zakhmi kar sakte hain | Zakhmi, zimmedari |

## Visual model: humanoid control layers

<div className="visual-panel">
<div className="visual-flow">
<div className="flow-step"><span>Jism</span>Links, joints, actuators, haath, paon</div>
<div className="flow-step"><span>Balance</span>Center of mass, ZMP, capture point, gait phase</div>
<div className="flow-step"><span>Perception</span>Depth, lidar, IMU, force/torque, object state, insaan ki maujoodgi</div>
<div className="flow-step"><span>Motion Planning</span>Footstep plan, baazu trajectory, majmooi QP</div>
<div className="flow-step"><span>Manipulation</span>Rasaai, grasp, force regulation, chhodna</div>
<div className="flow-step"><span>Interaction</span>Baat cheet, nazar, gesture, intent, proxemics</div>
</div>
</div>

## Deep dive subtopics

### Forward aur inverse kinematics

#### Forward kinematics

Forward kinematics (FK) joint angles ka vector diye jaane par har link ki position aur orientation ka hisaab lagata hai. Ek serial chain ke $n$ joints ke liye, FK homogeneous transformation matrices ka istemal karke bayan kiya jata hai:

$$
T_i^\{i-1\} = \begin\{bmatrix\}
R_i(\theta_i) & d_i \\
0 & 1
\end\{bmatrix\}
$$

jahan $R_i(\theta_i)$ joint $i$ ke liye $3 \times 3$ rotation matrix hai (Denavit-Hartenberg parameters $\alpha_i, a_i, d_i, \theta_i$ se mustaheel) aur $d_i$ translation vector hai. Base ke lihaaz se end-effector ki pose hai:

$$
T_n^0 = T_1^0 \cdot T_2^1 \cdot \ldots \cdot T_n^\{n-1\} = \prod_\{i=1\}^\{n\} T_i^\{i-1\}
$$

End-effector ki position $T_n^0$ ke aakhri column se haasil ki jaati hai, aur uski orientation ooparein baayein $3 \times 3$ submatrix se.

#### Inverse kinematics

Inverse kinematics (IK) sawal ka jawaab deta hai: makhsoos end-effector pose $T_d$ diye jaane par, joint vector $\mathbf\{q\}$ dhoondhein jaise $FK(\mathbf\{q\}) = T_d$. Redundant manipulators ke liye (kaam se zyada DOF), IK namukammal hai aur izafi behtareen criteria ki zaroorat hoti hai (masalan, joint torque ko kam se kam karna, singularities se bachna, manipulability ko zyada se zyada karna).

Jacobian par mabni IK hal geometric Jacobian $J(\mathbf\{q\})$ istemal karta hai:

$$
\dot\{\mathbf\{x\}\} = J(\mathbf\{q\}) \dot\{\mathbf\{q\}\}
$$

Ek damped least-squares IK qadam hai:

$$
\Delta \mathbf\{q\} = J^T (J J^T + \lambda^2 I)^\{-1\} \Delta \mathbf\{x\}
$$

jahan $\Delta \mathbf\{x\}$ pose error hai aur $\lambda$ damping factor hai jo singularities ke qareeb bimari se bachata hai. Amal mein, IK har control cycle (50-500 Hz) mein hal kiya jaata hai taake waqt ke saath badalne wali trajectories ko track kiya ja sakay.

#### Humanoid tangon ke liye kinematics

6 DOF wali humanoid tang ke liye (koolhay par 3, ghutne par 1, ankle par 2), IK joint angles diye jaane par koolhay ke lihaaz se paon ki pose ka hisaab lagata hai, ya ulta joint angles ka hisaab lagata hai taake paon ko maqami jagah par rakha ja sakay. Tang IK ke liye zaroori hai:

- **Paon ke qadam ki jagah**: Hering phase ke dauran paon ko target position par rakhne ke liye koolhay aur ghutne ke angles ka hisaab lagana.
- **Balance adjustment**: Zameen ke lihaaz se dhad ko jhukane ke liye ankle angles ka hisaab lagana.
- **Zameen ka dhancha**: Konon ya seedhi ki unchai ke mutabiq paon ki samt badalna.

### Center of mass aur balance

#### Center of mass ka hisaab

Ek humanoid ka center of mass (CoM) tamam links ka mass-weighted average position hai:

$$
\mathbf\{r\}_\{CoM\} = \frac\{\sum_\{i=1\}^\{N\} m_i \mathbf\{r\}_i\}\{\sum_\{i=1\}^\{N\} m_i\}
$$

jahan $m_i$ link $i$ ka mass hai aur $\mathbf\{r\}_i$ link $i$ ke center of mass ki duniya ke frame mein position hai. 20 links wali humanoid ke liye, iske liye har link ki FK ko track karna aur unke hisson ka jama lena zaroori hai.

CoM velocity hai:

$$
\dot\{\mathbf\{r\}\}_\{CoM\} = \frac\{\sum_\{i=1\}^\{N\} m_i \dot\{\mathbf\{r\}\}_i\}\{\sum_\{i=1\}^\{N\} m_i\}
$$

aur CoM acceleration hai:

$$
\ddot\{\mathbf\{r\}\}_\{CoM\} = \frac\{\sum_\{i=1\}^\{N\} m_i \ddot\{\mathbf\{r\}\}_i\}\{\sum_\{i=1\}^\{N\} m_i\}
$$

Balance control ke liye, CoM ki zameen ke satah par projection support polygon ke andar ya uske qareeb rehna chahiye (paon ke contact points ka muheet).

#### Zero moment point (ZMP)

ZMP wo point hai jahan zameen ke reaction forces ka majmooa ufqi mahuron ke baare mein zero hota hai. Balance ke liye ZMP shart hai:

$$
\mathbf\{p\}_\{ZMP\} = \mathbf\{r\}_\{CoM\} - \frac\{\ddot\{\mathbf\{r\}\}_\{CoM\} \cdot z_\{CoM\}\}\{g + \ddot\{z\}_\{CoM\}\}
$$

jahan $z_\{CoM\}$ CoM ki unchai hai aur $g$ gravitational acceleration hai. Agar $\mathbf\{p\}_\{ZMP\}$ support polygon ke andar hai, toh robot static taur par mustahkam hai. Agar wo baahar hai, toh robot palat jayega.

#### Capture point

Capture point (CP) ZMP tajziye ko mutaharik chaal mein barhata hai. Yeh wo point hai jahan robot ko apna agla paon ka qadam rakhna hoga taake mukammal taur par ruk jaye:

$$
\mathbf\{r\}_\{CP\} = \mathbf\{r\}_\{CoM\} + \frac\{\dot\{\mathbf\{r\}\}_\{CoM\}\}\{\omega_0\}
$$

jahan $\omega_0 = \sqrt\{g / z_\{CoM\}\}$ lakiri ulte pendulum model ki qudrati frequency hai. Agar capture point support polygon ke andar hai, toh robot ruk sakta hai. Agar wo baahar hai, toh robot gire baghair ya ek izafi qadam liye baghair nahi ruk sakta.

#### Linear inverted pendulum model (LIPM)

LIPM do paon ki chaal ka sab se aasan dynamic model hai. Yeh samajhta hai ke CoM mustaheel unchai $z_\{CoM\}$ par harkat karta hai, aur ufqi dynamics alag hoti hai:

$$
\ddot\{x\} = \frac\{g\}\{z_\{CoM\}\} (x - p_x)
$$
$$
\ddot\{y\} = \frac\{g\}\{z_\{CoM\}\} (y - p_y)
$$

jahan $(p_x, p_y)$ ZMP ki jagah hai. Yeh lakiri model preview control aur gait planning ke liye MPC faraham karta hai.

### Gait patterns

#### Walking gait

Do paon ki walking gait alternation stance aur hering phases se banti hai:

1. **Double support**: Dono paon zameen par. CoM ek paon se doosre par mutaharik hota hai. Muddat: gait cycle ka 10-20%.
2. **Single support (stance)**: Ek paon zameen mein qaim hai. CoM stance paon ke oopar se guzarta hai. Muddat: gait cycle ka 40-50%.
3. **Hering**: Azad tang aage hilti hai. Ghutna zameen se saaf hone ke liye mudta hai. Muddat: gait cycle ka 30-40%.

Walking pattern generator ek CoM trajectory ka hisaab lagata hai (aam taur par lateral aur sagittal planes mein sinusoidal ya cubic spline) aur paon ki jagahen, phir LIPM ya preview control istemal karta hai taake joint trajectories bana sakay.

#### Running gait

Running mein ek flight phase (dono paon zameen se baahar) shamil hoti hai aur zyada actuator power ki zaroorat hoti hai. Chalne se ahem farq:

- **Flight phase**: Gait cycle ka 20-40%. CoM ek ballistic parabola ki pairvi karta hai.
- **Zyada impact forces**: Landing forces jism ke wazn ka 2-3 guna tak pahunch sakti hain.
- **Lashkdar tawanaai ka zakheera**: Tendons ya springs push off ke dauran tawanaai jama aur release karte hain.
- **Chhota zameen contact waqt**: Tez actuator response ki zaroorat hoti hai.

Running gaits aam taur par spring-mass models ya centroidal momentum dynamics ka istemal karke banaye jaate hain.

#### Seedhi chadhna

Seedhi chadhne ke liye zaroori hai:
- **Durust paon ki jagah**: Har qadam ko kafi clearance ke saath tread par lena hota hai.
- **Zyada ghutne ki unchai**: Hering tang ko riser ki unchai se saaf hona hota hai.
- **Umdoodi CoM displacement**: Har qadam mein CoM ko riser ki unchai tak uthana hota hai.
- **Zyada joint torques**: Koolhay aur ghutne ke torques gravity ke khilaf jism ka wazn uthane ki wajah se numayaan taur par barh jaate hain.

Seedhi chadhna aam taur par ek qadam barhne wali CoM trajectory aur tarmim shuda paon ke qadam ke planner ka istemal karke manzoori kiya jaata hai jo discrete unchai ki tabdiliyon ko madd-e-nazar rakhta hai.

#### Zameen ka dhancha

Ghair humwaar zameen ke liye zaroori hai:
- **Paon ki samt ka control**: Ghutne ko zameen ke dhanchay ke mutabiq hona hota hai.
- **Tagayyur qadam ki unchai**: Hering tang trajectory ko rukawaton ke mutabiq hona chahiye.
- **Real-time perception**: Depth camera ya force sensor robot se aage ki zameen ki geometry ka pata lagata hai.
- **Reactive replanning**: Agar paon ka contact ghair mutawaqqa hai (masalan, phisalna), toh planner ko fori taur par recovery qadam banana hota hai.

#### Manipulation ke liye force aur torque control

#### Impedance control

Impedance control end-effector position error aur interaction force ke darmiyaan ta'alluq ko munazzam karta hai:

$$
\mathbf\{F\} = K (\mathbf\{x\}_d - \mathbf\{x\}) + D (\dot\{\mathbf\{x\}\}_d - \dot\{\mathbf\{x\}\})
$$

jahan $K` stiffness matrix hai aur $D` damping matrix hai. Kam $K` wala ek lashkaar humanoid baazu ghair zaroori force ke baghair aaram se objects ko chhu sakta hai, jabke zyada $K` wala ek sakht baazu durust positioning haasil karta hai.

#### Grasp planning

Humanoid hands ke liye grasp planning mein shamil hain:

1. **Pre-grasp configuration**: Haath ko object ke upar ek jagah par le jayen jabke ungliyan khuli hon.
2. **Approach trajectory**: Approach vector ke saath aage badhein (aam taur par grasp ki satah se amoodi).
3. **Ungliyan band karna**: Tactile sensors ya motor current ke zariye contact ka pata chalne tak ungliyan band karein.
4. **Force regulation**: Object ko kuchalne se bachne ke liye kafi grip force lagayen.
5. **Uthane ki tasdeeq**: Wrist par force/torque ki nigrani karke tasdeeq karein ke object pakda hua hai.

Grasp ke mayar ko GWS (Grasp Wrench Space) ya epsilon quality measure jaise paimaishon ka istemal karke jancha jaata hai, jo grasp ki taqat ko beqarar karne wali zyada se zyada wrench ko mapa hai.

#### Contact sequencing

Multi-contact manipulation ke liye (masalan, rasaai karte hue mez ke saath tek lagana), robot ko balance barqarar rakhte hue kaam haasil karne ke liye contacts ko tarteeb dena hota hai. Contact planner muntakhib karta hai:

- Kaun se links mahol ko chhoenge
- Contact ke qaim hone aur release hone ka tarteeb
- Har contact par lagayi jane wali taqatein

### Social robotics aur proxemics

#### Proxemics zones

Proxemics insaan-insaan interaction ke liye chaar makaani zones muqarrar karta hai, jo seedha insaan-robot interaction par lagu hote hain:

| Zone | Faasla | Robot ke liye istemal |
|---|---|---|
| Zaathee | 0-0.45 m | Tibi robots, mu'awanat ki nigrani |
| Zaathee | 0.45-1.2 m | Ta'awuni manipulation, handover |
| Samaji | 1.2-3.6 m | Khidmati robots, istiqbaal, salaam |
| Aama | >3.6 m | Godaam, gasht, delivery |

#### Wazahat paziiri aur qabil-e-taqseem

Ek samaji taur par maharat rakhne wala robot apni intent ka izhaar karta hai taake insaan bata saken ke agla kya hoga:

- **Wazahat paziiri**: Robot ki hirakt insaan nazareen ke liye parhne wali honi chahiye. Masalan, rasaai ki hirakt mein ek wazeh, seedha trajectory hona chahiye na ke ek ghumaa hua rasta.
- **Qabil-e-taqseem**: Robot ko dohraye jaane wale halat mein musalsal bartav karna chahiye taake insaan uske iqaam ki peshgoi kar saken.
- **Velocity profiling**: Insaan ki taraf tezi se badhna jari mehsoos ho sakta hai; ek jhundi ki shakal ki velocity profile zyada qudrati mehsoos hoti hai.

#### Nazar aur gesture

- **Nazar ki samt**: Rasaai se pehle object ki taraf dekhna intent ka ishara karta hai. Insaan ki taraf dehkhna tawajjuh ya tasdeeq ki darkhwast ka ishara karta hai.
- **Sar ki samt**: Jism ki hirakt se pehle sar ko agli hirakt ki samt mein mudna wazahat paziiri behtar banata hai.
- **Gesture**: Ishara karne ka gesture ya sar hilana baghair baat cheet ke intent ka izhaar kar sakta hai.
- **Zaathee jagah ka ehtram**: Robot ko zaathee zone mein daakhil hote waqt rukna ya sust hona chahiye taake insaan ko react karne ka waqt mile.

## Humanoid robot ki tafseelaat

Neeche diye gaye table mein taleemi aur tehqeeqi lab ke liye munasib aam humanoid aur legged platforms ka muwazna hai:

| Platform | Qism | DOF | Unchai | Wazn | Compute | Actuators | Sensors | Qeemat (taqreebi) |
|---|---|---|---|---|---|---|---|---|
| Unitree G1 | Mukammal humanoid | 23 | 1.27 m | 35 kg | NVIDIA Orin (up to 100 TOPS) | High-torque electric | RGB-D, lidar, IMU, force/torque | $16,000-$30,000 |
| Unitree H1 | Mukammal humanoid | 19 | 1.80 m | 47 kg | NVIDIA Orin (up to 100 TOPS) | High-torque electric | RGB-D, lidar, IMU, force/torque | $30,000-$60,000 |
| Unitree Go2 | Chupaya | 12 | 0.34 m | 12 kg | NVIDIA Orin (up to 100 TOPS) | Electric motors | RGB-D, lidar, IMU | $1,600-$3,000 |
| Robotis OP3 | Mini humanoid | 20 | 0.50 m | 3.5 kg | Intel NUC or Jetson | Dynamixel servos | Camera, IMU | $5,000-$8,000 |
| Hiwonder TonyPi | Taleemi humanoid | 19 | 0.45 m | 1.8 kg | Raspberry Pi 4B or Jetson Nano | Hiwonder servos | Camera, IMU | $1,200-$2,500 |

### Actuator ka muwazna

| Platform | Torque (koolha) | Torque (ghutna) | Peak power | Control bandwidth |
|---|---|---|---|---|
| Unitree G1 | ~120 Nm | ~45 Nm | ~200 W | High (custom PMSM) |
| Unitree H1 | ~220 Nm | ~100 Nm | ~400 W | High (custom PMSM) |
| Unitree Go2 | ~30 Nm | ~25 Nm | ~30 W | Medium |
| Robotis OP3 | ~1.5 Nm | ~1.5 Nm | ~3 W | Low (servo) |
| Hiwonder TonyPi | ~0.5 Nm | ~0.5 Nm | ~0.5 W | Low (servo) |

### Software ecosystem

| Platform | ROS 2 support | Isaac ROS | SLAM | Reinforcement learning | Simulation |
|---|---|---|---|---|---|
| Unitree G1/H1 | Full (unitree_ros2) | Yes | Yes | Yes (Isaac Gym) | Isaac Sim, MuJoCo |
| Unitree Go2 | Full (unitree_ros2) | Yes | Yes | Yes (Isaac Gym) | Isaac Sim, MuJoCo |
| Robotis OP3 | Partial (OP3 ROS package) | No | Limited | Limited | Webots, Gazebo |
| Hiwonder TonyPi | Partial (Hiwonder SDK) | No | No | No | Limited |

### Mukhtasir humanoid ke liye URDF misaal

Neeche diya gaya URDF ek kamm se kam humanoid ki wazahat karta hai jis mein ek dhad, do 3-DOF tangein, aur ek sir hai. Har joint torque aur raftaar ki hadood ke saath ek revolute actuator istemal karta hai.

```xml
<?xml version="1.0"?>
<robot name="simple_humanoid">
  <!-- Material definitions -->
  <material name="torso_mat">
    <color rgba="0.2 0.2 0.8 1.0"/>
  </material>
  <material name="leg_mat">
    <color rgba="0.8 0.2 0.2 1.0"/>
  </material>

  <!-- Base link (pelvis) -->
  <link name="pelvis">
    <visual>
      <geometry><box size="0.3 0.15 0.1"/></geometry>
      <material name="torso_mat"/>
    </visual>
    <collision>
      <geometry><box size="0.3 0.15 0.1"/></geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <inertia ixx="0.01" iyy="0.01" izz="0.01" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <!-- Torso link -->
  <link name="torso">
    <visual>
      <geometry><box size="0.25 0.15 0.4"/></geometry>
      <material name="torso_mat"/>
    </visual>
    <collision>
      <geometry><box size="0.25 0.15 0.4"/></geometry>
    </collision>
    <inertial>
      <mass value="10.0"/>
      <inertia ixx="0.05" iyy="0.05" izz="0.03" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <!-- Torso joint -->
  <joint name="torso_joint" type="revolute">
    <parent link="pelvis"/>
    <child link="torso"/>
    <origin xyz="0 0 0.25" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" effort="50" velocity="1.0"/>
  </joint>

  <!-- Left hip link -->
  <link name="left_hip">
    <visual>
      <geometry><cylinder radius="0.05" length="0.15"/></geometry>
      <material name="leg_mat"/>
    </visual>
    <collision>
      <geometry><cylinder radius="0.05" length="0.15"/></geometry>
    </collision>
    <inertial>
      <mass value="1.5"/>
      <inertia ixx="0.002" iyy="0.002" izz="0.001" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <!-- Left hip pitch joint -->
  <joint name="left_hip_pitch" type="revolute">
    <parent link="pelvis"/>
    <child link="left_hip"/>
    <origin xyz="0.1 0 -0.05" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-2.0" upper="1.0" effort="40" velocity="4.0"/>
  </joint>

  <!-- Left thigh link -->
  <link name="left_thigh">
    <visual>
      <geometry><cylinder radius="0.04" length="0.3"/></geometry>
      <material name="leg_mat"/>
    </visual>
    <collision>
      <geometry><cylinder radius="0.04" length="0.3"/></geometry>
    </collision>
    <inertial>
      <mass value="3.0"/>
      <origin xyz="0 0 -0.15"/>
      <inertia ixx="0.01" iyy="0.01" izz="0.002" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <!-- Left hip roll joint -->
  <joint name="left_hip_roll" type="revolute">
    <parent link="left_hip"/>
    <child link="left_thigh"/>
    <origin xyz="0 0 -0.075" rpy="0 0 0"/>
    <axis xyz="1 0 0"/>
    <limit lower="-0.5" upper="0.5" effort="40" velocity="4.0"/>
  </joint>

  <!-- Left knee link -->
  <link name="left_knee">
    <visual>
      <geometry><cylinder radius="0.035" length="0.3"/></geometry>
      <material name="leg_mat"/>
    </visual>
    <collision>
      <geometry><cylinder radius="0.035" length="0.3"/></geometry>
    </collision>
    <inertial>
      <mass value="2.5"/>
      <origin xyz="0 0 -0.15"/>
      <inertia ixx="0.008" iyy="0.008" izz="0.001" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <!-- Left knee joint -->
  <joint name="left_knee" type="revolute">
    <parent link="left_thigh"/>
    <child link="left_knee"/>
    <origin xyz="0 0 -0.3" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="0" upper="2.5" effort="30" velocity="4.0"/>
  </joint>

  <!-- Left foot link -->
  <link name="left_foot">
    <visual>
      <geometry><box size="0.15 0.08 0.03"/></geometry>
      <material name="leg_mat"/>
    </visual>
    <collision>
      <geometry><box size="0.15 0.08 0.03"/></geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.001" iyy="0.001" izz="0.001" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <!-- Left ankle joint -->
  <joint name="left_ankle" type="revolute">
    <parent link="left_knee"/>
    <child link="left_foot"/>
    <origin xyz="0 0 -0.3" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.8" upper="0.8" effort="15" velocity="4.0"/>
  </joint>

  <!-- Right leg (mirror of left) -->
  <link name="right_hip">
    <visual>
      <geometry><cylinder radius="0.05" length="0.15"/></geometry>
      <material name="leg_mat"/>
    </visual>
    <collision>
      <geometry><cylinder radius="0.05" length="0.15"/></geometry>
    </collision>
    <inertial>
      <mass value="1.5"/>
      <inertia ixx="0.002" iyy="0.002" izz="0.001" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <joint name="right_hip_pitch" type="revolute">
    <parent link="pelvis"/>
    <child link="right_hip"/>
    <origin xyz="-0.1 0 -0.05" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-2.0" upper="1.0" effort="40" velocity="4.0"/>
  </joint>

  <link name="right_thigh">
    <visual>
      <geometry><cylinder radius="0.04" length="0.3"/></geometry>
      <material name="leg_mat"/>
    </visual>
    <collision>
      <geometry><cylinder radius="0.04" length="0.3"/></geometry>
    </collision>
    <inertial>
      <mass value="3.0"/>
      <origin xyz="0 0 -0.15"/>
      <inertia ixx="0.01" iyy="0.01" izz="0.002" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <joint name="right_hip_roll" type="revolute">
    <parent link="right_hip"/>
    <child link="right_thigh"/>
    <origin xyz="0 0 -0.075" rpy="0 0 0"/>
    <axis xyz="1 0 0"/>
    <limit lower="-0.5" upper="0.5" effort="40" velocity="4.0"/>
  </joint>

  <link name="right_knee">
    <visual>
      <geometry><cylinder radius="0.035" length="0.3"/></geometry>
      <material name="leg_mat"/>
    </visual>
    <collision>
      <geometry><cylinder radius="0.035" length="0.3"/></geometry>
    </collision>
    <inertial>
      <mass value="2.5"/>
      <origin xyz="0 0 -0.15"/>
      <inertia ixx="0.008" iyy="0.008" izz="0.001" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <joint name="right_knee" type="revolute">
    <parent link="right_thigh"/>
    <child link="right_knee"/>
    <origin xyz="0 0 -0.3" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="0" upper="2.5" effort="30" velocity="4.0"/>
  </joint>

  <link name="right_foot">
    <visual>
      <geometry><box size="0.15 0.08 0.03"/></geometry>
      <material name="leg_mat"/>
    </visual>
    <collision>
      <geometry><box size="0.15 0.08 0.03"/></geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.001" iyy="0.001" izz="0.001" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <joint name="right_ankle" type="revolute">
    <parent link="right_knee"/>
    <child link="right_foot"/>
    <origin xyz="0 0 -0.3" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.8" upper="0.8" effort="15" velocity="4.0"/>
  </joint>

  <!-- Head link -->
  <link name="head">
    <visual>
      <geometry><sphere radius="0.08"/></geometry>
      <material name="torso_mat"/>
    </visual>
    <collision>
      <geometry><sphere radius="0.08"/></geometry>
    </collision>
    <inertial>
      <mass value="1.5"/>
      <inertia ixx="0.001" iyy="0.001" izz="0.001" ixy="0" ixz="0" iyz="0"/>
    </inertial>
  </link>

  <!-- Head pan joint -->
  <joint name="head_pan" type="revolute">
    <parent link="torso"/>
    <child link="head"/>
    <origin xyz="0 0 0.25" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.5" upper="1.5" effort="5" velocity="4.0"/>
  </joint>
</robot>
```

### Joint controller configuration

Neeche diya gaya ROS 2 YAML configuration ek humanoid tang ke liye joint level PD controller ki wazahat karta hai. Har joint mein position aur velocity gains, torque limits, aur hifazat ki hadein hain.

```yaml
# Joint controller configuration for humanoid leg
# File: config/joint_controllers.yaml

controller_manager:
  ros__parameters:
    update_rate: 500  # Hz

    joint_state_broadcaster:
      type: joint_state_broadcaster/JointStateBroadcaster

    left_hip_pitch_controller:
      type: joint_trajectory_controller/JointTrajectoryController
      joints:
        - left_hip_pitch
      command_interfaces:
        - position
      state_interfaces:
        - position
        - velocity
      state_publish_rate: 250.0
      action_monitor_rate: 20.0
      allow_partial_joints_goal: false

    left_knee_controller:
      type: joint_trajectory_controller/JointTrajectoryController
      joints:
        - left_knee
      command_interfaces:
        - position
      state_interfaces:
        - position
        - velocity
      state_publish_rate: 250.0
      action_monitor_rate: 20.0

    left_ankle_controller:
      type: joint_trajectory_controller/JointTrajectoryController
      joints:
        - left_ankle
      command_interfaces:
        - position
      state_interfaces:
        - position
        - velocity
      state_publish_rate: 250.0
      action_monitor_rate: 20.0

    # Impedance controller for compliant interaction
    left_hip_impedance_controller:
      type: impedance_controller/ImpedanceController
      joints:
        - left_hip_pitch
      command_interfaces:
        - position
        - velocity
      state_interfaces:
        - position
        - velocity
      state_publish_rate: 500.0

      stiffness:
        left_hip_pitch:
          translational: [500.0, 500.0, 500.0]
          rotational: [100.0, 100.0, 100.0]
      damping:
        left_hip_pitch:
          translational: [50.0, 50.0, 50.0]
          rotational: [10.0, 10.0, 10.0]

# Safety parameters
safety_limiter:
  ros__parameters:
    position_limits:
      left_hip_pitch:
        min: -2.0
        max: 1.0
      left_knee:
        min: 0.0
        max: 2.5
      left_ankle:
        min: -0.8
        max: 0.8
    velocity_limits:
      left_hip_pitch: 4.0
      left_knee: 4.0
      left_ankle: 4.0
    torque_limits:
      left_hip_pitch: 40.0
      left_knee: 30.0
      left_ankle: 15.0
```

### Balance control algorithm

Neeche diya gaya pseudocode ek real-time balance controller ki wazahat karta hai jo single-support phase ke dauran CoM ko support polygon se oopar barqarar rakhne ke liye ankle aur hip torques ka hisaab lagata hai.

```python
import numpy as np

class BalanceController:
    """
    Real-time balance controller for bipedal humanoid.
    Uses ZMP-based feedback with capture point regulation.
    """

    def __init__(self, mass, com_height, gravity=9.81):
        self.mass = mass
        self.com_height = com_height
        self.gravity = gravity
        self.omega_0 = np.sqrt(gravity / com_height)

        # Feedback gains
        self.kp_zmp = 500.0    # ZMP error proportional gain
        self.kd_zmp = 100.0    # ZMP error derivative gain
        self.kp_capture = 2.0  # Capture point gain
        self.kd_capture = 0.5  # Capture point damping

        # State limits
        self.max_ankle_torque = 30.0  # Nm
        self.max_hip_torque = 40.0    # Nm

    def compute_com_state(self, joint_positions, joint_velocities, mass_properties):
        """Compute CoM position and velocity from joint states."""
        com_pos = np.zeros(3)
        com_vel = np.zeros(3)
        total_mass = 0.0

        for i, link in enumerate(mass_properties):
            m = link['mass']
            r = link['com_offset']  # offset from joint
            q = joint_positions[i]
            qd = joint_velocities[i]

            # Simplified: compute link COM in world frame
            com_pos += m * (link['joint_pos'] + rotate(q, r))
            com_vel += m * link['joint_vel']
            total_mass += m

        com_pos /= total_mass
        com_vel /= total_mass
        return com_pos, com_vel

    def compute_zmp(self, com_pos, com_vel, com_accel):
        """Compute zero moment point from CoM state."""
        x_com, y_com = com_pos[0], com_pos[1]
        x_ddot, y_ddot = com_accel[0], com_accel[1]
        z_com = self.com_height

        # ZMP position (sagittal and lateral)
        p_zmp_x = x_com - (x_ddot * z_com) / (self.gravity + 0.0)
        p_zmp_y = y_com - (y_ddot * z_com) / (self.gravity + 0.0)

        return np.array([p_zmp_x, p_zmp_y])

    def compute_capture_point(self, com_pos, com_vel):
        """Compute capture point for dynamic stopping."""
        return com_pos[:2] + com_vel[:2] / self.omega_0

    def compute_support_polygon(self, foot_positions):
        """Compute convex hull of foot contact points."""
        # Simplified: use foot corners
        points = []
        for foot in foot_positions:
            center = foot['position']
            half_l = foot['length'] / 2
            half_w = foot['width'] / 2
            R = rotation_matrix(foot['orientation'])
            corners = [
                R @ np.array([half_l, half_w, 0]),
                R @ np.array([half_l, -half_w, 0]),
                R @ np.array([-half_l, half_w, 0]),
                R @ np.array([-half_l, -half_w, 0]),
            ]
            points.extend([center + c[:2] for c in corners])
        return np.array(points)

    def point_in_polygon(self, point, polygon):
        """Check if point is inside convex polygon using cross products."""
        n = len(polygon)
        inside = True
        for i in range(n):
            edge = polygon[(i + 1) % n] - polygon[i]
            to_point = point - polygon[i]
            cross = edge[0] * to_point[1] - edge[1] * to_point[0]
            if cross < 0:
                inside = False
                break
        return inside

    def compute_balance_torques(self, com_pos, com_vel, com_accel,
                                 foot_positions, stance_foot_idx):
        """
        Compute ankle and hip torques to regulate balance.

        Returns:
            ankle_torque: Torque to apply at the stance ankle
            hip_torque: Torque to apply at the hip for balance
        """
        # Compute current ZMP
        zmp = self.compute_zmp(com_pos, com_vel, com_accel)

        # Compute support polygon
        support_poly = self.compute_support_polygon(foot_positions)

        # Compute capture point
        cp = self.compute_capture_point(com_pos, com_vel)

        # Desired ZMP (center of support polygon)
        zmp_desired = np.mean(support_poly, axis=0)

        # ZMP error
        zmp_error = zmp - zmp_desired
        zmp_error_dot = -self.kp_zmp * zmp_error  # simplified derivative

        # Ankle torque (sagittal plane)
        ankle_torque = (
            self.kp_zmp * zmp_error[1] +
            self.kd_zmp * zmp_error_dot[1]
        )

        # Hip torque (lateral balance, from capture point regulation)
        cp_desired = zmp_desired  # want CP near center of support
        cp_error = cp - cp_desired
        hip_torque = (
            self.kp_capture * cp_error[1] +
            self.kd_capture * (-com_vel[1])
        )

        # Clamp to limits
        ankle_torque = np.clip(ankle_torque,
                                -self.max_ankle_torque,
                                self.max_ankle_torque)
        hip_torque = np.clip(hip_torque,
                              -self.max_hip_torque,
                              self.max_hip_torque)

        return ankle_torque, hip_torque

    def step(self, dt, com_pos, com_vel, com_accel,
             foot_positions, stance_foot_idx):
        """
        Single control step. Call at 500 Hz.

        Returns:
            torque_commands: dict of joint torques
        """
        ankle_torque, hip_torque = self.compute_balance_torques(
            com_pos, com_vel, com_accel,
            foot_positions, stance_foot_idx
        )

        torque_commands = {
            'left_ankle': ankle_torque if stance_foot_idx == 0 else 0.0,
            'right_ankle': ankle_torque if stance_foot_idx == 1 else 0.0,
            'left_hip_roll': hip_torque if stance_foot_idx == 0 else 0.0,
            'right_hip_roll': hip_torque if stance_foot_idx == 1 else 0.0,
        }

        return torque_commands
```

### Inverse kinematics ke saath grasp planning

Neeche di gayi misaal ek grasp planning pipeline ki numais karta hai jo ek humanoid baazu ke saath kisi object tak rasaai aur grasp karne ke liye IK ka istemal karti hai.

```python
import numpy as np
from scipy.optimize import minimize

class GraspPlanner:
    """
    Grasp planner for a 7-DOF humanoid arm.
    Computes IK solutions for pre-grasp, grasp, and lift poses.
    """

    def __init__(self, dh_params):
        """
        Args:
            dh_params: List of (a, alpha, d, theta_offset) for each joint
        """
        self.dh = dh_params
        self.n_joints = len(dh_params)

        # Grasp parameters
        self.approach_distance = 0.15  # meters above object
        self.grip_force = 10.0  # Newtons
        self.lift_height = 0.05  # meters

    def forward_kinematics(self, q):
        """Compute end-effector pose from joint angles."""
        T = np.eye(4)
        for i in range(self.n_joints):
            a, alpha, d, theta_off = self.dh[i]
            theta = q[i] + theta_off

            Ti = np.array([
                [np.cos(theta), -np.sin(theta)*np.cos(alpha),
                 np.sin(theta)*np.sin(alpha), a*np.cos(theta)],
                [np.sin(theta), np.cos(theta)*np.cos(alpha),
                 -np.cos(theta)*np.sin(alpha), a*np.sin(theta)],
                [0, np.sin(alpha), np.cos(alpha), d],
                [0, 0, 0, 1]
            ])
            T = T @ Ti

        position = T[:3, 3]
        rotation = T[:3, :3]
        return position, rotation

    def jacobian(self, q, delta=1e-6):
        """Numerical Jacobian for position control."""
        J = np.zeros((3, self.n_joints))
        pos0, _ = self.forward_kinematics(q)

        for i in range(self.n_joints):
            q_plus = q.copy()
            q_plus[i] += delta
            pos_plus, _ = self.forward_kinematics(q_plus)
            J[:, i] = (pos_plus - pos0) / delta

        return J

    def solve_ik(self, target_pos, q_init=None, max_iter=100, tol=1e-4):
        """
        Solve IK using damped least-squares.

        Args:
            target_pos: Desired end-effector position (3,)
            q_init: Initial joint configuration
            max_iter: Maximum iterations
            tol: Position error tolerance

        Returns:
            q_solution: Joint angles achieving target position
            success: Whether IK converged
        """
        if q_init is None:
            q_init = np.zeros(self.n_joints)

        q = q_init.copy()

        for iteration in range(max_iter):
            pos, _ = self.forward_kinematics(q)
            error = target_pos - pos

            if np.linalg.norm(error) < tol:
                return q, True

            J = self.jacobian(q)
            # Damped least-squares
            lambda_d = 0.1
            dq = J.T @ np.linalg.solve(
                J @ J.T + lambda_d**2 * np.eye(3), error
            )

            # Joint limit clamping
            q = np.clip(q + dq, -np.pi, np.pi)

        return q, False

    def plan_grasp(self, object_pos, object_orientation, hand_width):
        """
        Plan a complete grasp sequence.

        Args:
            object_pos: Object center position (3,)
            object_orientation: Object orientation as rotation matrix (3,3)
            hand_width: Width of the object for grip aperture

        Returns:
            Waypoints: List of (position, grip_width, phase) tuples
        """
        waypoints = []

        # Phase 1: Pre-grasp (above and behind the object)
        approach_dir = object_orientation[:, 2]  # approach along z-axis
        pre_grasp_pos = object_pos + self.approach_distance * approach_dir
        pre_grasp_pos[2] += 0.05  # slight lift for clearance
        waypoints.append((pre_grasp_pos, hand_width * 1.2, 'approach'))

        # Phase 2: Approach (move down to grasp height)
        grasp_pos = object_pos.copy()
        waypoints.append((grasp_pos, hand_width * 1.1, 'approach'))

        # Phase 3: Grasp (close fingers)
        waypoints.append((grasp_pos, hand_width * 0.9, 'grasp'))

        # Phase 4: Lift
        lift_pos = grasp_pos.copy()
        lift_pos[2] += self.lift_height
        waypoints.append((lift_pos, hand_width * 0.9, 'lift'))

        return waypoints

    def compute_grasp_quality(self, contact_points, contact_normals,
                               friction_coeff=0.5):
        """
        Compute epsilon quality measure for a grasp.

        Args:
            contact_points: List of contact positions (3, n_contacts)
            contact_normals: List of contact normals (3, n_contacts)
            friction_coeff: Coulomb friction coefficient

        Returns:
            quality: Scalar grasp quality (higher is better)
        """
        n_contacts = contact_points.shape[1]

        # Build grasp matrix (maps contact wrenches to object wrench)
        G = np.zeros((6, 6 * n_contacts))

        for i in range(n_contacts):
            r = contact_points[:, i]
            n = contact_normals[:, i]

            # Contact Jacobian (force component)
            G[:3, 6*i:6*i+3] = np.eye(3)
            # Contact Jacobian (moment component)
            G[3:, 6*i:6*i+3] = skew_symmetric(r)
            # Friction cone constraint (simplified)
            G[3:, 6*i+3:6*i+6] = np.eye(3) * friction_coeff

        # Compute singular values
        _, s, _ = np.linalg.svd(G)

        # Epsilon quality: minimum singular value
        quality = s[-1]

        return quality


def skew_symmetric(v):
    """Compute skew-symmetric matrix from 3-vector."""
    return np.array([
        [0, -v[2], v[1]],
        [v[2], 0, -v[0]],
        [-v[1], v[0], 0]
    ])
```

## Lab budget planning guide

### Tier 1: Sirf simulation ($0-$500)

Is tier ko koi physical hardware ki zaroorat nahi. Saari seekhawat simulation mein hoti hai.

| Item | Laqat | Maqsad |
|---|---|---|
| Cloud GPU access (Google Colab, AWS) | $0-$200/mo | Bhaari simulation (Isaac Sim, MuJoCo) |
| Mojooda laptop/desktop | $0 | Development mahol |
| ROS 2 Humble (muft) | $0 | Robot middleware |
| Isaac Sim (muft tier) | $0 | GPU se tezi se simulation |
| MuJoCo (muft) | $0 | Physics simulation |

**Yeh tier kya sikhata hai**: ROS 2 ki bunyaadi baatein, URDF modeling, kinematics simulation, bunyaadi control algorithms, perception pipeline development.

**Hudood**: Koi real hardware friction nahi, koi sensor noise nahi, koi battery constraints nahi, koi hifazat ke tahaffuzat nahi.

### Tier 2: Edge perception aur proxy ($1,500-$5,000)

Physical edge computing aur ek saada robot platform jodta hai.

| Item | Laqat | Maqsad |
|---|---|---|
| NVIDIA Jetson Orin Nano | $250 | Edge AI compute |
| Intel RealSense D435i | $250 | Depth camera |
| Bosch BNO085 IMU | $30 | Samt aur tezi |
| Unitree Go2 (base) | $1,600 | Chupaya locomotion platform |
| External GPU (ikhtiyari) | $500-$1,000 | Taleem mein tezi |
| USB cables, mounting hardware | $50 | Integration |

**Yeh tier kya sikhata hai**: Edge deployment, sensor fusion, SLAM, quadruped locomotion, real hardware par ROS 2, hifazat ke protocols.

**Hudood**: Koi manipulation nahi, koi humanoid kinematics nahi, koi bipedal balance nahi.

### Tier 3: Humanoid transfer ($10,000-$40,000)

Mukammal humanoid platform mo'awina infrastructure ke saath.

| Item | Laqat | Maqsad |
|---|---|---|
| NVIDIA Jetson AGX Orin | $2,000 | High-performance edge compute |
| Intel RealSense D455 | $350 | Lamba faasla depth |
| Unitree G1 (base) | $16,000 | Humanoid platform |
| RTX 4070+ workstation | $2,000 | Simulation aur taleem |
| Force/torque sensors (x2) | $1,000 | Manipulation feedback |
| Safety net / tether | $200 | Girne se hifazat |
| Mazeed actuators aur cables | $500 | Dekh bhaal |

**Yeh tier kya sikhata hai**: Bipedal locomotion, majmooi control, manipulation, real hardware par IK, insaan-robot interaction, deployment workflows.

**Hudood**: Zyada hifazat ka bojh, mahdood battery life, taleem yafta operators ki zaroorat.

### Budget behtari ke tajaweez

1. **Simulation se shuru karein**: Hardware khareedne se pehle 2-3 mahine simulation mein sarmaya kari. Zyada tareen control algorithms simulation mein tasdeeq kiye ja sakte hain.
2. **Istemal shuda ya refurbished khareedein**: Unitree aur Robotis platforms kabhi kabhi 30-50% chhoot par refurbished units pesh karte hain.
3. **Labz ke darmiyaan share karein**: Ek wahid humanoid platform 3-4 tulib ilm groups ki khidmat kar sakta hai fi semester scheduled lab sessions ke saath.
4. **Open source ka faida uthayein**: ROS 2, Isaac ROS, aur MuJoCo muft hain. Zyada tareen humanoid control algorithms code ke saath shaya kiye jaate hain.
5. **Hardware hasil karne ka marhala bandi karein**: Tier 1 se shuru karein, internaliz mein izafe ke saath Tier 2 ke ajzaa jodein, aur sirf tehqeeqi output is ki wajah banaye toh Tier 3 mein sarmaya kari.

## Robot lab ke ikhtiyarat

| Ikhtiyar | Kis ke liye behtarin | Tabdila | Zaroori compute | Hifazat ki satah |
|---|---|---|---|---|
| Sirf simulation | Ibtidai seekhna, hifazat, kam laqat | Koi real hardware friction nahi | Koi bhi CPU/GPU | Koi nahi |
| Sensors ke saath edge kit | Perception aur deployment amli | Koi mukammal jismani hirakt nahi | Jetson ya uske mutradif | Kam |
| Proxy robot ya baazu | ROS 2, navigation, manipulation amli | Haqeeqi humanoid nahi | Jetson ya NUC | Kam-darmiyana |
| Mini humanoid | Chalne aur kinematics ki numais | Mahdood compute aur payload | NUC ya Jetson | Darmiyana |
| Premium humanoid | Real humanoid capstone tehqeeq | Zyada laqat aur hifazat ka bojh | Jetson AGX + RTX | Zyada |

## Mini case study: Budget ka rasta muntakhib karna

Agar class tak RTX workstations ya mukammal humanoid ki pahunch nahi hai, toh yeh abhi bhi staged lab ke zariye seekh sakti hai:

1. Bhaari simulation ke liye cloud ya mushtarka GPU access istemal karein. Google Colab Pro ($50/mo) Isaac Sim aur PyTorch taleem ke liye NVIDIA T4 GPUs tak access faraham karta hai.
2. Edge inference aur deployment constraints ke liye Jetson kits istemal karein. Jetson Orin Nano ($250) ROS 2 chalata hai aur RealSense depth data ko 30 FPS par process kar sakta hai.
3. Perception labs ke liye RealSense cameras aur IMUs istemal karein. D435i ($250) visual-inertial odometry ke liye munasib rang, depth, aur IMU data faraham karta hai.
4. Mahfuz physical numaishon ke liye proxy robot ya robotic arm istemal karein. Unitree Go2 ($1,600) humanoid balance ki pachidgi ke baghair locomotion ke usoolon ki numais karta hai.
5. Hifazat aur budget ko real hardware ki ijazat tak virtual humanoid capstone ko simulation mein rakhein. Isaac Sim mein ek virtual Unitree G1 mukammal control stack chala sakta hai.

## Amali lab

<div className="lab-box">
<h3>Lab: Robotics lab design karein</h3>
<p>Teen tiers ke saath ek lab kharidari ka manzoor banayein: kamm se kamm, tajweez kardah, aur premium. Workstation, edge kit, sensors, aur robot platform shamil karein. Wazahat karein ke har tier kya sikha sakta hai.</p>

**Deliverables**:

1. Har tier ke liye itemized laqat ke saath ek spreadsheet
2. Har tier ke liye ek safha ka justification jo seekhne ke nataij ki wazahat karta hai
3. Premium tier ke liye ek khatray ka jaiza (hifazat ke protocols, zaroori taleem)
4. Ek semester schedule jo dikhata hai ke nab mein har tier kab istemal hoga

**Jaize ke mayar**:

- Laqat ki durustgi (mojooda listings ke khilaf qeematon ki tasdeeq karein)
- Seekhne ke nataij ka intihaan (har item ko makhsoos course ke maqasid se naqshe bandi karein)
- Hifazat ki mukammal (tamam khatraat aur taffuz ki hikmat-e-amaliyon ki shanakht karein)
- Qabil-e-amal (kya manzoor ko mahkame ke budget cycle ke andar nafaz kiya ja sakta hai?)
</div>

## Quiz

### Apni samajh ki jaanch karein

1. Kyun humanoid robots se control karna mushkil hai?
2. Zero moment point kya hai, aur yeh balance ke liye kyun ahem hai?
3. Capture point ZMP se kaise mukhtalif hai?
4. Manipulation ke liye impedance control ka position control ke liye bunyadi faida kya hai?
5. Char proxemics zones kya hain, aur kaun sa zone kisi robot ko insaan ko cup dene par lagu hota hai?
6. Do wajahen batayein ke kyun ek mukammal humanoid ek hi compute wali quadruped se zyada mehnga hai.
7. Kyun bipedal seedhi chadhne ko humwaar zameen par chalne se zyada joint torque ki zaroorat hoti hai?
8. Damped least-squares tareeqa kya hai, aur yeh IK mein kyun istemal hota hai?
9. Linear inverted pendulum model bipedal gait planning ko kaise aasan banata hai?
10. Ek staged lab hikmat-e-amali mein, aap ko ek waqt mein sirf ek naya khatra ka satah kyun jodna chahiye?

### Jawabat ki kunji

1. Unhein chhote support polygon par dynamic balance ka intezam karna hota hai, 20+ tie joints ko coordinate karna hota hai, hybrid contact transitions ko sambhalna hota hai, aur ek saath manipulation karna hota hai. Chupayon ka ek mustahkam base hota hai aur bahut kam DOF hote hain.
2. ZMP wo point hai jahan zameen ke reaction forces ka majmooa ufqi mahuron ke baare mein zero hota hai. Agar ZMP support polygon ke andar hai, toh robot static taur par mustahkam hai. Agar wo baahar hai, toh robot palat jayega.
3. ZMP mojooda tawazun ki nishandahi karta hai; capture point nishandahi karta hai ke robot ko rukne ke liye agla paon ka qadam kahan rakhna chahiye. Capture point ZMP tajziye ko mutaharik, kai qadmon ki chaal mein barhata hai.
4. Impedance control position error aur interaction force ke darmiyaan ta'alluq ko munazzam karta hai, jo objects ke saath lashkaar contact ki ijaazat deta hai. Position control contact ke toratein ki parwah kiye baghair andha taur par target tak pahunchne ki koshish karta hai, jo object ya robot ko nuqsan pahuncha sakta hai.
5. Zaathee (0-0.45 m), zaathee (0.45-1.2 m), samaji (1.2-3.6 m), aama (>3.6 m). Cup dena zaathee zone mein hota hai.
6. Humanoid ko 6 DOF wali do paon tangi chahiye (balance aur zameen ke dhanchay ke liye), khade teenane ke liye bhari dhad, aur zyada pachidgi majmooi controllers. Quadruped ka fitri taur par mustahkam char nuqta base hota hai.
7. Har qadam mein CoM ko riser ki unchai tak uthana hota hai, jis ke liye gravity ke khilaf musalsal koolha aur ghutne ki tawsi ki zaroorat hoti hai. Is ke alawa, hering tang ko riser se saaf hone ke liye kafi uncha uthna hota hai, jo torque ki darkhwast mein izafa karta hai.
8. Yeh IK hal ko $\Delta \mathbf\{q\} = J^T (J J^T + \lambda^2 I)^\{-1\} \Delta \mathbf\{x\}$ ke taur par hisaab lagata hai, jo singularities ke qareeb bimari se bachata hai damping term $\lambda^2 I$ ko hataye jaane wale matrix mein shamil karke.
9. LIPM mustaheel CoM unchai samajhta hai aur ufqi dynamics ko do azad lakiri masawat mein alag karta hai, jo muassir gait banane ke liye preview control aur MPC faraham karta hai.
10. Har naya subsystem (sensors, actuators, communication, khud-mukhtari) mumkina naakaami ke tareeqe mutarif karwata hai. Ek waqt mein ek shamil karna judaai aur debugging ki ijaazat deta hai baghair team ko ek saath ghair maloom cheezon se dabaye.

## Lughat

| Istilah | Tareef |
|---|---|
| **Bipedal locomotion** | Do paon par chalna, jis ke liye musalsal dynamic balance ka intizam zaroori hai |
| **Capture point (CP)** | Wo point jahan ek paon ka qadam robot ko mukammal taur par ruk de |
| **Center of mass (CoM)** | Robot mein tamam links ka mass-weighted average position |
| **Denavit-Hartenberg (DH) parameters** | Char parameters (a, alpha, d, theta) jo har joint-link pair ki geometry bayan karte hain |
| **Degrees of freedom (DOF)** | Robot ki configuration ko mukammal taur par bayan karne ke liye zaroori azad mutaghaiyyat ki tadaad |
| **Dynamixel servo** | Taleemi aur tehqeeqi robots mein aam taur par istemal hone wali smart actuators ki lakeer |
| **Epsilon quality** | Grasp matrix ke minimum singular value par mabni grasp quality paimaish |
| **Forward kinematics (FK)** | Joint angles se end-effector position aur orientation ka hisaab |
| **Gait cycle** | Tamam tangon ke liye stance aur hering phases ka ek mukammal silsila |
| **Grasp wrench space (GWS)** | Tamam wrenches ka majmooa jo ek grasp ka muqabla kar sakta hai |
| **Homogeneous transformation** | 4x4 matrix jo ek operation mein rotation aur translation ki numaindagi karta hai |
| **Impedance control** | Ek control hikmat-e-amali jo position error aur interaction force ke darmiyaan dynamic ta'alluq ko munazzam karti hai |
| **Inverse kinematics (IK)** | Makhsoos end-effector pose haasil karne ke liye joint angles ka hisaab |
| **Jacobian** | Joint velocities ko end-effector velocities se jodne wala matrix |
| **Legibility** | Robot ki hirakt ki woh had jis mein insaan nazareen use parh aur samajh sakte hain |
| **Linear inverted pendulum model (LIPM)** | Bipedal chaal ke tajziye ke liye mustaheel CoM unchai samajhne wala ek aasan dynamic model |
| **Model predictive control (MPC)** | Ek behtareen par mabni control tareeqa jo mustaqbil ke halaat ka andaza lagata hai aur mehdood par amal ko behtar banata hai |
| **Operational space control** | Infraadi joint torques ke bajaye seedha end-effector forces aur torques ka control |
| **Proxemics** | Insaanon ki jagah ke istemal aur zaathee faasle ke interaction par asaar ka mutalaa |
| **Quadratic program (QP)** | Ek quadratic maqsad aur lakiri constraints wala behtareen masla, majmooi control mein istemal hota hai |
| **SLAM** | Simultaneous Localization and Mapping: Naqsaha banate hue robot ko uske andar maqami banana |
| **Spring-mass model** | Tang ko spring aur jism ko point mass samajh kar ek aasan running model |
| **Support polygon** | Tamam zameen contact points ka muheet; static balance ke liye CoM projection uske andar rehna chahiye |
| **URDF** | Unified Robot Description Format: Robot kinematics, dynamics, aur visual appearance bayan karne ka ek XML mayar |
| **Whole-body control** | Makhsoos end-effector forces haasil karte hue balance barqarar rakhte hue tamam joints ko ek saath coordinate karna |
| **Zero moment point (ZMP)** | Wo point jahan zameen ke reaction forces ka majmooa ufqi mahuron ke baare mein zero hota hai |

## Hifazat aur hardware notes

<div className="safety-box">
<h3>Hardware escalation protocol</h3>
<p>Simulation se edge kits se proxy robots tak jayen mukammal humanoid hirakt se pehle. Har qadam ko ek waqt mein sirf ek naya khatra ka satah jodna chahiye.</p>

**Tiers ke liye zaroori hifazati tadabeer**:

- **Tier 1 (Simulation)**: Mamooli computer hifazat. Koi khususi taleem ki zaroorat nahi.
- **Tier 2 (Edge + Proxy)**: E-stop button, quadruped ke liye tether, nigrani wali operation, actuators ke qareeb koi dheelay kapde nahi.
- **Tier 3 (Humanoid)**: Hard hat zone, safety net ya overhead tether, do shakhs operation (spotter + operator), pahunch ke andar emergency stop, battery disconnect protocol, har session se pehle pre-flight checklist, haadse ki report farm.

**Dekh bhaal ka schedule**:

- Har lab session se pehle actuator cables aur connectors ka jaiza lein
- Har mahine battery ki sehat ko check karein (voltage, salahiyat, androoni muzahmat)
- Teen mahine mein ek baar firmware aur ROS 2 packages update karein
- Zaroorat ke mutabiq purane paon ke pads aur rubber ke ajzaa badlein
- Tamam hardware haadsaat ko ek mushtarka log mein darj karein
</div>

## Mazeed mutalaa

- Kajita, S., et al. *Introduction to Humanoid Robotics*. Springer, 2015.
- Siciliano, B., and Khatib, O. *Springer Handbook of Robotics*. Springer, 2016.
- Walking pattern generation: Kajita, S., et al. "Biped walking pattern generation by using preview control of zero-moment point." ICRA 2003.
- Capture point: Pratt, J., et al. "Capture point: A step toward humanoid push recovery." Humanoids 2006.
- Impedance control: Hogan, N. "Impedance control: An approach to manipulation." ASME J. Dynamic Systems, 1985.
- Proxemics: Hall, E.T. *The Hidden Dimension*. Doubleday, 1966.
- Unitree documentation: https://www.unitree.com
- ROS 2 Humble docs: https://docs.ros.org/en/humble/
