---
sidebar_position: 1
title: Digital Twins with Gazebo and Unity
description: Physics simulation with Gazebo and Unity, URDF/SDF robot descriptions, collision modeling, sensors, depth cameras, LiDAR, IMUs, and testable digital twin environments.
keywords: [Gazebo, Unity, digital twins, URDF, SDF, physics simulation, robot simulation, LiDAR, IMU, ROS 2, Isaac Sim, sim-to-real transfer, ODE, Bullet, DART, MuJoCo, sensor noise models, domain randomization, collision geometry, inertial properties, launch files, TCP connector]
---

import PersonalizationToolbar from '@site/src/components/Personalization/PersonalizationToolbar';

# Gazebo اور Unity کے ساتھ ڈیجیٹل ٹونز

<PersonalizationToolbar chapterSlug="simulation/digital-twins-gazebo-unity" />

## سیکھنے کے نتائج

- بیان کریں کہ فیزیکل روبوٹ کی ت deploy سے پہلے سمیولیشن کیوں ضروری ہے۔
- Gazebo فیزیکس سمیولیشن اور Unity ویژولائیشن کے کردار کا موازنہ کریں۔
- تشخیص کریں کہ URDF، SDF، LiDAR، ڈیپتھ کیمرے، اور IMU روبوٹ ٹیسٹنگ کو کیسے معاونت کرتے ہیں۔
- ایک انسان نما ٹاسک کے لیے سمیولیشن ٹیسٹ ڈیزائن کریں۔
- URDF اور SDF فائلیں تشکیل کریں جو روبوٹ کی کنیمیٹکس، ڈائنمکس، اور سینسر پلیسمنٹ بیان کرتی ہیں۔
- سینسر پلگ انز کو حقیقی نوائز ماڈلز، اپ ڈیٹ ریٹس، اور فیلڈ آف ویو کی پابندیوں کے ساتھ کنفیگر کریں۔
- ODE، Bullet، DART، اور MuJoCo کے درمیان مختلف روبوٹ مورفولوجیز کے لیے فیزیکس انجین ٹریڈ آفس کا تجزیہ کریں۔
- ریئلٹی گیپ کو کم کرنے کے لیے ڈومین رنڈمائزیشن اور سم ٹو ریئل ٹرانسفر تکنیکوں کو لاگو کریں۔
- انٹرپنیٹریشن، فلوٹنگ بیس ان اسٹیبلٹی، اور سینسر الیزنگ سمیت عام سمیولیشن خرابیوں کی اصلاح کریں۔

## تصور کی وضاحت

### ہارڈیور سے پہلے سمیولیشن کیوں

ڈیجیٹل ٹون ایک روبوٹ، ماحول، یا انٹرایکشن کی سمیولیٹڈ کاپی ہے۔ یہ حقیقت کی بالکل عین مطابق نہیں ہوتی۔ یہ ایک کنٹرولڈ ٹیسٹ اسپیس ہے جہاں سیکھنے والے مشین کے حرکت شروع کرنے سے پہلے مسائل بے نقاب کر سکتے ہیں۔ سمیولیشن فوری ہارڈیور ڈیپلویمنٹ کے مقابلے میں تین اہم فوائد فراہم کرتا ہے:

1. **حفاظت** -- آپ فیلیور موڈز (جوائنٹ اوور ٹارک، غیر مستحکم گیٹس، ٹکرانے کی بحالی) کو ہارڈیور تباہ کیے یا انسانوں کو زخمی کیے بغیر ٹیسٹ کر سکتے ہیں۔
2. **تکرار پذیری** -- ہر رن ایک جیسی ابتدائی شرائط سے شروع ہوتا ہے، جو ایکل ویری ابل کو الگ کرنے والے کنٹرولڈ تجربات کو ممکن بناتا ہے۔
3. **رفتار** -- سینکڑوں ٹیسٹ اپیسوڈز کمپیوٹ کلسٹر پر پیرالل میں چل سکتے ہیں، جو مہینوں کی فیزیکل ٹیسٹنگ کو گھنٹوں میں سانپیت کر دیتے ہیں۔

### Gazebo: فیزیکس پہلے والا سمیولیٹر

Gazebo فیزیکس، ٹکرانے، گریوٹی، روبوٹ ڈسکرپشنز، اور سینسر سمیولیشن کے لیے مفید ہے۔ یہ خاص طور پر روبوٹکس ریسرچ کے لیے ڈیزائن کیا گیا تھا اور ROS اور ROS 2 کے ساتھ وقف بریج پیکجز کے ذریعے نیٹیو انٹیگریشن رکھتا ہے۔ Gazebo پلگ ان مبنی آرکیٹیکچر استعمال کرتا ہے: ہر سینسر، فیزیکس انجین، اور مڈل ویئر انٹیگریشن ایک لوڈ ہونے والا پلگ ان ہے۔ یہ اسے قابل توسیع بناتا ہے لیکن اس کا مطلب یہ بھی ہے کہ کنفیگریشن اکثر طویل ہوتی ہے۔

انسان نما سمیولیشن کے لیے اہم Gazebo صلاحیتیں:

- **فیزیکس انجنز**: ODE (ڈیفالٹ)، Bullet، DART، اور Simbody فیلنگ کے مطابق منتخب کیے جا سکتے ہیں۔
- **سینسر پلگ انز**: کیمرہ، ڈیپتھ کیمرہ، LiDAR (رے اور GPU)، IMU، فورس ٹارک، کنٹاکٹ سینسر، GPS، اور میگنیٹومیٹر پلگ انز معیاری Gazebo ڈسٹریبیوشنز کے ساتھ آتے ہیں۔
- **ماڈل ڈیٹابیس**: کمیونٹی مینٹینڈ ماڈل ریپوزٹری پہلے سے بنے ہوئے روبوٹس، اشیاء، اور ماحولات فراہم کرتی ہے۔
- **ROS انٹیگریشن**: `gazebo_ros_pkgs` اور نیا `ros_gz` بریج Gazebo اور ROS 2 نوڈز کے درمیان دو طرفہ ٹاپک اور سروس کمیونیکیشن فراہم کرتا ہے۔

### Unity: اعلیٰ فیڈلٹی ویژولائیشن اور انٹرایکشن

Unity اعلیٰ فیڈلٹی ویژولائیشن اور انسان-روبوت انٹرایکشن سینز فراہم کر سکتا ہے۔ یہ اصل میں گیمز کے لیے ڈیزائن کیے گئے ریئل ٹائم رنڈرنگ انجین پر مبنی ہے، جو اسے ویژول کوالٹی، اینیمیشن، اور VR/AR انٹیگریشن میں فائدہ دیتا ہے۔ تاہم، Unity روبوٹکس کے لیے ڈیزائن نہیں کیا گیا تھا، اس لیے فیزیکس اور ROS انٹیگریشن کو محتاط سیٹ اپ کی ضرورت ہوتی ہے۔

انسان نما سمیولیشن کے لیے اہم Unity صلاحیتیں:

- **URDF امپورٹر**: Unity Robotics پیکج URDF فائلیں پارس کرتا ہے اور جوائنٹ کنٹرولرز کے ساتھ مربوط روبوٹ GameObjects بناتا ہے۔
- **ROS TCP کنیکٹر**: ایک نیٹ ورک مبنی بریج جو Unity اور ROS 2 ورک اسپیس کے درمیان TCP پر ROS 2 ٹاپکس (سینسر ڈیٹا، جوائنٹ اسٹیٹس، کمانڈز) اسٹریم کرتا ہے۔
- **ML-Agents**: رینفورسمنٹ لرننگ ٹولkit جو Unity ماحولات میں براہ راست پالیسیز ٹریننگ کی اجازت دیتا ہے۔
- **HDRP رنڈرنگ**: ہائی ڈیفینیشن رنڈر پائپ لائن ویژن مبنی الگورتھم کی ٹریننگ کے لیے مفید فوٹو ریئلسٹک سینز تیار کرتی ہے۔

### Isaac Sim: NVIDIA کا سمیولیشن پلیٹ فارم

Isaac Sim NVIDIA Omniverse پر مبنی فوٹو ریئلسٹک روبوٹکس سمیولیشن اور سنتھیٹک ڈیٹا جنریشن فراہم کرتا ہے۔ یہ فیزیکلی صحیح لائٹنگ اور ریفلیکشنز کے لیے RTX رے ٹیسینگ استعمال کرتا ہے۔ اسے RTX ہارڈیور یا مناسب کلاؤڈ GPU کی ضرورت ہوتی ہے۔ Isaac Sim خاص طور پر ان کے لیے مضبوط ہے:

- پرسیپشن ماڈلز کی ٹریننگ کے لیے سنتھیٹک ڈیٹا جنریشن۔
- GPU ایکسلریٹڈ فیزیکس کے ساتھ بڑے پیمانے پر پیرالل سمیولیشن۔
- NVIDIA کے روبوٹکس اسٹیک (Isaac Lab، Isaac Cortex) کے ساتھ انٹیگریشن۔

یہ تینوں ٹولز مل کر طالب علموں کو روبوٹکس کی مکینکس اور تجربہ دونوں کو سمجھنے میں مدد کرتے ہیں۔

## بصری ماڈل: سمیولیشن اسٹیک

<div className="visual-panel">
<div className="visual-flow">
<div className="flow-step"><span>روبوت ماڈل</span>URDF، جوائنٹس، لینکس، انرٹیا، ٹکرانے کی جیومٹری</div>
<div className="flow-step"><span>دنیا کا ماڈل</span>کمرے، فلور، اشیاء، رکاوٹیں، لائٹنگ</div>
<div className="flow-step"><span>فیزیکس</span>گریوٹی، ٹکرانا، رگڑ، ڈیمپنگ، جوائنٹ لیمٹس</div>
<div className="flow-step"><span>سینسرز</span>RGB کیمرہ، ڈیپتھ، LiDAR، IMU، فورس ٹارک</div>
<div className="flow-step"><span>مڈل ویئر</span>ROS 2 ٹاپکس، سروسز، ایکشنز، TF ٹری</div>
<div className="flow-step"><span>ٹیسٹ</span>نیویگیشن، مینیپولیشن، لوکوموشن، فیلیور بحالی</div>
</div>
</div>

## Gazebo اور Unity کا موازنہ

| ٹول | مضبوط کہاں | خبردار رہیں |
|---|---|---|
| Gazebo | فیزیکس، روبوٹ ڈسکرپشنز، سینسرز، ROS انٹیگریشن | اضافی کام کے بغیر ویژول ریئلسٹک محدود ہو سکتی ہے |
| Unity | ویژول ماحولات، انٹرایکشن سینز، انسان سامنا سمیولیشن | فیزیکس اور ROS انٹیگریشن کو محتاط سیٹ اپ کی ضرورت |
| Isaac Sim | فوٹو ریئلسٹک روبوٹکس سمیولیشن اور سنتھیٹک ڈیٹا | RTX ہارڈیور یا مناسب کلاؤڈ GPU کی ضرورت |

## تفصیلی URDF ساخت

URDF (Unified Robot Description Format) ایک XML مبنی فارمیٹ ہے جو روبوٹ کو جوائنٹس سے جڑے لینکس کی ٹری کے طور پر بیان کرتا ہے۔ Gazebo میں ہر انسان نما روبوٹ ایک URDF فائل سے شروع ہوتا ہے۔

### کم از کم انسان نما URDF مثال

```xml
<?xml version="1.0"?>
<robot name="minimal_humanoid">
  <!-- Base link (torso) -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.3 0.2 0.4"/>
      </geometry>
      <material name="torso_material">
        <color rgba="0.2 0.6 0.8 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.3 0.2 0.4"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="15.0"/>
      <inertia ixx="0.1" ixy="0.0" ixz="0.0"
               iyy="0.15" iyz="0.0" izz="0.1"/>
    </inertial>
  </link>

  <!-- Left hip joint -->
  <joint name="left_hip_joint" type="revolute">
    <parent link="base_link"/>
    <child link="left_upper_leg"/>
    <origin xyz="-0.1 0.0 -0.25" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1.0"/>
    <dynamics damping="0.5" friction="0.1"/>
  </joint>

  <link name="left_upper_leg">
    <visual>
      <geometry>
        <cylinder radius="0.06" length="0.35"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.06" length="0.35"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <origin xyz="0 0 -0.175"/>
      <inertia ixx="0.02" ixy="0.0" ixz="0.0"
               iyy="0.02" iyz="0.0" izz="0.005"/>
    </inertial>
  </link>

  <!-- Left knee joint -->
  <joint name="left_knee_joint" type="revolute">
    <parent link="left_upper_leg"/>
    <child link="left_lower_leg"/>
    <origin xyz="0.0 0.0 -0.35" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="0.0" upper="2.6" effort="80" velocity="1.0"/>
    <dynamics damping="0.3" friction="0.05"/>
  </joint>

  <link name="left_lower_leg">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.35"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.35"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="4.0"/>
      <origin xyz="0 0 -0.175"/>
      <inertia ixx="0.015" ixy="0.0" ixz="0.0"
               iyy="0.015" iyz="0.0" izz="0.004"/>
    </inertial>
  </link>

  <!-- Left ankle joint -->
  <joint name="left_ankle_joint" type="revolute">
    <parent link="left_lower_leg"/>
    <child link="left_foot"/>
    <origin xyz="0.0 0.0 -0.35" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.78" upper="0.78" effort="50" velocity="1.0"/>
    <dynamics damping="0.2" friction="0.05"/>
  </joint>

  <link name="left_foot">
    <visual>
      <geometry>
        <box size="0.1 0.06 0.02"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <box size="0.1 0.06 0.02"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0"
               iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <!-- Right side mirrors left -->
  <joint name="right_hip_joint" type="revolute">
    <parent link="base_link"/>
    <child link="right_upper_leg"/>
    <origin xyz="-0.1 0.0 -0.25" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1.0"/>
    <dynamics damping="0.5" friction="0.1"/>
  </joint>

  <link name="right_upper_leg">
    <visual>
      <geometry>
        <cylinder radius="0.06" length="0.35"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.06" length="0.35"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <origin xyz="0 0 -0.175"/>
      <inertia ixx="0.02" ixy="0.0" ixz="0.0"
               iyy="0.02" iyz="0.0" izz="0.005"/>
    </inertial>
  </link>

  <joint name="right_knee_joint" type="revolute">
    <parent link="right_upper_leg"/>
    <child link="right_lower_leg"/>
    <origin xyz="0.0 0.0 -0.35" rpy="0 0 0"/>
    <axis xyz="1 0 0"/>
    <limit lower="0.0" upper="2.6" effort="80" velocity="1.0"/>
    <dynamics damping="0.3" friction="0.05"/>
  </joint>

  <link name="right_lower_leg">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.35"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.35"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="4.0"/>
      <origin xyz="0 0 -0.175"/>
      <inertia ixx="0.015" ixy="0.0" ixz="0.0"
               iyy="0.015" iyz="0.0" izz="0.004"/>
    </inertial>
  </link>

  <joint name="right_ankle_joint" type="revolute">
    <parent link="right_lower_leg"/>
    <child link="right_foot"/>
    <origin xyz="0.0 0.0 -0.35" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.78" upper="0.78" effort="50" velocity="1.0"/>
    <dynamics damping="0.2" friction="0.05"/>
  </joint>

  <link name="right_foot">
    <visual>
      <geometry>
        <box size="0.1 0.06 0.02"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <box size="0.1 0.06 0.02"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0"
               iyy="0.001" iyz="0.0" izz="0.001"/>
    </inertial>
  </link>

  <!-- Head -->
  <joint name="neck_joint" type="revolute">
    <parent link="base_link"/>
    <child link="head"/>
    <origin xyz="0.0 0.0 0.25" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-0.78" upper="0.78" effort="20" velocity="0.5"/>
  </joint>

  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="3.0"/>
      <inertia ixx="0.005" ixy="0.0" ixz="0.0"
               iyy="0.005" iyz="0.0" izz="0.005"/>
    </inertial>
  </link>

  <!-- Camera sensor mounted on head -->
  <gazebo reference="head">
    <sensor type="camera" name="head_camera">
      <update_rate>30</update_rate>
      <camera name="head_camera_sensor">
        <horizontal_fov>1.047</horizontal_fov>
        <image>
          <width>640</width>
          <height>480</height>
          <format>R8G8B8</format>
        </image>
        <clip>
          <near>0.1</near>
          <far>100.0</far>
        </clip>
      </camera>
      <plugin name="head_camera_plugin" filename="libgazebo_ros_camera.so">
        <ros>
          <namespace>/robot</namespace>
        </ros>
        <frame_name>head</frame_name>
      </plugin>
    </sensor>
  </gazebo>
</robot>
```

### اہم URDF عناصر کی وضاحت

| عنصر | مقصد |
|---|---|
| `<link>` | کنیمیٹک چین میں ایک ٹھوس جسم جس میں بصری، ٹکرانے، اور انرٹیل خصوصیات ہیں |
| `<joint>` | دو لینکس کو قسم (ریوولوٹ، پرزمیٹک، فکسڈ، مسلسل)، محور، حدود، اور ڈائنمکس کے ساتھ جوڑتا ہے |
| `<visual>` | رنڈرنگ کے لیے استعمال ہونے والا ظاہری شکل (میش یا پرائمٹیو جیومٹری) بیان کرتا ہے |
| `<collision>` | فیزیکس انجین کے ذریعے رابطے کی تشخیص کے لیے استعمال ہونے والی جیومٹری بیان کرتا ہے |
| `<inertial>` | ڈائنمکس انجین کے ذریعے استعمال ہونے والا ماس اور 3x3 انرٹیا ٹینسر |
| `<gazebo` | سینسر پلگ انز، مٹیریل رنگز، اور حوالہ جات کے لیے Gazebo مخصوص توسیعات |

## SDF دنیا فائل کی مثال

SDF (Simulation Description Format) URDF سے زیادہ اظہاری ہے اور Gazebo دنیاں کا فلک فارمیٹ ہے۔ ایک دنیا فائل سمیولیشن ماحول بیان کرتی ہے جس میں گریوٹی، فیزیکس انجین، لائٹنگ، ماڈلز، اور سینسر کنفیگریشنز شامل ہیں۔

```xml
<?xml version="1.0" ?>
<sdf version="1.9">
  <world name="humanoid_test_world">

    <!-- Physics engine configuration -->
    <physics name="ode_physics" type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
      <real_time_update_rate>1000</real_time_update_rate>
      <ode>
        <solver>
          <type>dantzig</type>
          <iters>50</iters>
          <sor>1.3</sor>
        </solver>
        <constraints>
          <cfm>0.0</cfm>
          <erp>0.2</erp>
          <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
          <contact_surface_layer>0.001</contact_surface_layer>
        </constraints>
      </ode>
    </physics>

    <!-- Gravity -->
    <gravity>0 0 -9.81</gravity>

    <!-- Magnetic field (for IMU simulation) -->
    <magnetic_field>5.6e-06 1.68e-05 -4.94e-05</magnetic_field>

    <!-- Atmospheric conditions for air drag simulation -->
    <atmosphere type="atmospheric_pressure"/>

    <!-- Lighting -->
    <light type="directional" name="sun">
      <pose>0 0 10 0 0 0</pose>
      <diffuse>0.8 0.8 0.8 1</diffuse>
      <specular>0.2 0.2 0.2 1</specular>
      <attenuation>
        <range>1000</range>
        <constant>0.9</constant>
        <linear>0.01</linear>
        <quadratic>0.001</quadratic>
      </attenuation>
      <direction>-0.5 0.1 -0.9</direction>
      <cast_shadows>true</cast_shadows>
    </light>

    <!-- Ground plane -->
    <include>
      <uri>model://ground_plane</uri>
    </include>

    <!-- Concrete floor with friction parameters -->
    <model name="concrete_floor">
      <static>true</static>
      <link name="floor_link">
        <visual name="floor_visual">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>20 20</size>
            </plane>
          </geometry>
          <material>
            <ambient>0.5 0.5 0.5 1</ambient>
            <diffuse>0.5 0.5 0.5 1</diffuse>
          </material>
        </visual>
        <collision name="floor_collision">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>20 20</size>
            </plane>
          </geometry>
          <surface>
            <friction>
              <ode>
                <mu>0.8</mu>
                <mu2>0.8</mu2>
                <fdir1>1 0 0</fdir1>
              </ode>
            </friction>
            <bounce>
              <ode>
                <bounce>0.1</bounce>
                <bounce_velocity>0.1</bounce_velocity>
              </ode>
            </bounce>
            <contact>
              <ode>
                <max_contacts>10</max_contacts>
                <layer>0.001</layer>
                <max_vel>100</max_vel>
              </ode>
            </contact>
          </surface>
        </collision>
      </link>
    </model>

    <!-- Table obstacle -->
    <model name="table">
      <static>true</static>
      <pose>2.0 0.5 0 0 0 0</pose>
      <link name="table_top">
        <visual name="top_visual">
          <geometry>
            <box size="1.0 0.6 0.02"/>
          </geometry>
        </visual>
        <collision name="top_collision">
          <geometry>
            <box size="1.0 0.6 0.02"/>
          </geometry>
        </collision>
        <pose>0 0 0.75 0 0 0</pose>
      </link>
      <link name="leg_1">
        <visual name="leg1_vis">
          <geometry><cylinder radius="0.03" length="0.75"/></geometry>
        </visual>
        <collision name="leg1_col">
          <geometry><cylinder radius="0.03" length="0.75"/></geometry>
        </collision>
        <pose>0.4 0.2 0.375 0 0 0</pose>
      </link>
      <link name="leg_2">
        <visual name="leg2_vis">
          <geometry><cylinder radius="0.03" length="0.75"/></geometry>
        </visual>
        <collision name="leg2_col">
          <geometry><cylinder radius="0.03" length="0.75"/></geometry>
        </collision>
        <pose>-0.4 0.2 0.375 0 0 0</pose>
      </link>
    </model>

    <!-- Robot include -->
    <include>
      <uri>model://minimal_humanoid</uri>
      <pose>0 0 1.2 0 0 0</pose>
    </include>

  </world>
</sdf>
```

## Python کے ذریعے Gazebo میں روبوٹس پیدا کرنا

نیچے دیا گیا Python اسکرپٹ Gazebo ROS سروس انٹرفیس کا استعمال کرتے ہوئے چلتے ہوئے Gazebo انستانس میں ایک روبوٹ ماڈل پیدا کرتا ہے:

```python
import rclpy
from rclpy.node import Node
from gazebo_msgs.srv import SpawnEntity
import os
import xacro


class RobotSpawner(Node):
    def __init__(self):
        super().__init__('robot_spawner')
        self.client = self.create_client(SpawnEntity, '/spawn_entity')
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Waiting for /spawn_entity service...')

    def spawn_from_xacro(self, xacro_path, robot_name, namespace=''):
        doc = xacro.process_file(xacro_path)
        robot_description = doc.toxml()

        request = SpawnEntity.Request()
        request.name = robot_name
        request.xml = robot_description
        request.robot_namespace = namespace
        request.reference_frame = 'world'

        future = self.client.call_async(request)
        rclpy.spin_until_future_complete(self, future)

        if future.result() is not None:
            self.get_logger().info(
                f'Spawned {robot_name}: {future.result().status_message}'
            )
        else:
            self.get_logger().error(
                f'Failed to spawn {robot_name}: {future.exception()}'
            )


def main():
    rclpy.init()
    spawner = RobotSpawner()

    xacro_file = os.path.join(
        os.getcwd(),
        'src', 'my_robot', 'urdf', 'humanoid.urdf.xacro'
    )
    spawner.spawn_from_xacro(xacro_file, 'minimal_humanoid', '/robot')

    spawner.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Gazebo سمیولیشن کے لیے ROS 2 لانچ فائل

ایک لانچ فائل Gazebo، روبوٹ اسٹیٹ پبلشر، اور کنٹرولر نوڈز کی شروعات کو منظم کرتی ہے:

```python
import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import ExecuteProcess, IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch_ros.actions import Node


def generate_launch_description():
    pkg_share = get_package_share_directory('my_robot_description')
    gazebo_share = get_package_share_directory('gazebo_ros')
    world_file = os.path.join(pkg_share, 'worlds', 'humanoid_test_world.sdf')
    urdf_file = os.path.join(pkg_share, 'urdf', 'humanoid.urdf')

    with open(urdf_file, 'r') as f:
        robot_description = f.read()

    # Launch Gazebo with the custom world
    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(gazebo_share, 'launch', 'gazebo.launch.py')
        ),
        launch_arguments={'world': world_file}.items(),
    )

    # Robot state publisher publishes TF transforms from URDF
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': robot_description}],
        output='screen',
    )

    # Joint state publisher for simulating joint values
    joint_state_publisher = Node(
        package='joint_state_publisher',
        executable='joint_state_publisher',
        name='joint_state_publisher',
        parameters=[{'use_sim_time': True}],
    )

    # Spawn the robot entity in Gazebo
    spawn_entity = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=[
            '-topic', 'robot_description',
            '-entity', 'minimal_humanoid',
            '-z', '1.2',
        ],
        output='screen',
    )

    return LaunchDescription([
        gazebo,
        robot_state_publisher,
        joint_state_publisher,
        spawn_entity,
    ])
```

## Unity ROS TCP کنیکٹر سیٹ اپ

ROS TCP کنیکٹر Unity اور ROS 2 ورک اسپیس کے درمیان دو طرفہ کمیونیکیشن فراہم کرتا ہے۔ سیٹ اپ کے لیے Unity سائیڈ پیکج اور ROS سائیڈ اینڈ پوائنٹ نوڈ دونوں کی ضرورت ہوتی ہے۔

### Unity سائیڈ سیٹ اپ (C# کمپوننٹ)

```csharp
using Unity.Robotics.ROSTCPConnector;
using UnityEngine;

public class ROSBridgeSetup : MonoBehaviour
{
    [SerializeField] string rosIPAddress = "127.0.0.1";
    [SerializeField] int rosPort = 10000;

    void Awake()
    {
        ROSConnection.instance.Connect(
            rosIPAddress,
            rosPort
        );
    }

    void Start()
    {
        // Subscribe to a ROS 2 topic
        ROSConnection.instance.Subscribe<GeometryMsgsTwist>(
            "/cmd_vel",
            CmdVelCallback
        );

        // Register a publisher for sensor data back to ROS
        ROSConnection.instance.RegisterPublisher<SensorMsgsImage>(
            "/unity/camera/image_raw"
        );
    }

    void CmdVelCallback(GeometryMsgsTwist msg)
    {
        // Apply velocity commands to the robot in Unity
        float linearSpeed = (float)msg.linear.x;
        float angularSpeed = (float)msg.angular.z;
        // Apply to rigidbody or articulation body controller
    }
}
```

### ROS سائیڈ اینڈ پوائنٹ نوڈ

```python
import rclpy
from rclpy.node import Node
from ros_tcp_endpoint.tcp_server import TcpServer


class UnityEndpoint(Node):
    def __init__(self):
        super().__init__('unity_endpoint')
        self.tcp_server = TcpServer(ros_node_name='unity_endpoint')
        self.get_logger().info('Unity ROS TCP endpoint initialized')


def main():
    rclpy.init()
    node = UnityEndpoint()
    rclpy.spin(node)
    rclpy.shutdown()
```

## سینسر پلگ ان کنفیگریشن

### کیمرہ پلگ ان (Gazebo)

```xml
<sensor type="camera" name="front_camera">
  <always_on>true</always_on>
  <update_rate>30</update_rate>
  <camera name="front_camera_sensor">
    <horizontal_fov>1.047</horizontal_fov>
    <image>
      <width>1920</width>
      <height>1080</height>
      <format>R8G8B8</format>
    </image>
    <clip>
      <near>0.05</near>
      <far>100.0</far>
    </clip>
    <noise>
      <type>gaussian</type>
      <mean>0.0</mean>
      <stddev>0.007</stddev>
    </noise>
  </camera>
  <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
    <ros>
      <namespace>/robot/sensors</namespace>
    </ros>
    <frame_name>front_camera_link</frame_name>
    <image_topicName>/robot/sensors/camera/image_raw</image_topicName>
    <camera_info_topicName>/robot/sensors/camera/camera_info</camera_info_topicName>
  </plugin>
</sensor>
```

### GPU LiDAR پلگ ان (Gazebo)

```xml
<sensor type="gpu_lidar" name="velodyne_vlp16">
  <always_on>true</always_on>
  <update_rate>20</update_rate>
  <lidar name="vlp16">
    <scan>
      <horizontal>
        <samples>360</samples>
        <resolution>1</resolution>
        <min_angle>-3.14159</min_angle>
        <max_angle>3.14159</max_angle>
      </horizontal>
      <vertical>
        <samples>16</samples>
        <resolution>1</resolution>
        <min_angle>-0.2618</min_angle>
        <max_angle>0.2618</max_angle>
      </vertical>
    </scan>
    <range>
      <min>0.1</min>
      <max>100.0</max>
    </range>
    <noise>
      <type>gaussian</type>
      <mean>0.0</mean>
      <stddev>0.01</stddev>
    </noise>
  </lidar>
  <plugin name="velodyne_plugin" filename="libgazebo_ros_gpu_laser.so">
    <ros>
      <namespace>/robot/sensors</namespace>
    </ros>
    <topicName>/robot/sensors/velodyne/points</topicName>
    <frameName>velodyne_link</frameName>
  </plugin>
</sensor>
```

### IMU پلگ ان (Gazebo)

```xml
<sensor type="imu" name="imu_sensor">
  <always_on>true</always_on>
  <update_rate>200</update_rate>
  <imu name="imu">
    <topicName>/robot/sensors/imu/data</topicName>
    <bodyName>base_link</bodyName>
    <referenceFrame>base_link</referenceFrame>
    <angular_velocity>
      <noise type="gaussian">
        <mean>0.0</mean>
        <stddev>0.0017</stddev>
      </noise>
    </angular_velocity>
    <linear_acceleration>
      <noise type="gaussian">
        <mean>0.0</mean>
        <stddev>0.0196</stddev>
      </noise>
    </linear_acceleration>
  </imu>
  <plugin name="imu_plugin" filename="libgazebo_ros_imu_sensor.so">
    <ros>
      <namespace>/robot/sensors</namespace>
    </ros>
    <topicName>/robot/sensors/imu/data_raw</topicName>
    <bodyName>base_link</bodyName>
    <frameName>imu_link</frameName>
  </plugin>
</sensor>
```

### ڈیپتھ کیمرہ پلگ ان (Gazebo)

```xml
<sensor type="depth" name="depth_camera">
  <always_on>true</always_on>
  <update_rate>30</update_rate>
  <camera name="depth_sensor">
    <horizontal_fov>1.047</horizontal_fov>
    <image>
      <width>640</width>
      <height>480</height>
      <format>R8G8B8</format>
    </image>
    <clip>
      <near>0.1</near>
      <far>10.0</far>
    </clip>
    <noise>
      <type>gaussian</type>
      <mean>0.0</mean>
      <stddev>0.005</stddev>
    </noise>
  </camera>
  <plugin name="depth_camera_controller" filename="libgazebo_ros_depth_camera.so">
    <ros>
      <namespace>/robot/sensors</namespace>
    </ros>
    <frameName>depth_camera_link</frameName>
    <pointCloudTopicName>/robot/sensors/depth/points</pointCloudTopicName>
    <depthImageTopicName>/robot/sensors/depth/image_raw</depthImageTopicName>
    <depthImageCameraInfoTopicName>/robot/sensors/depth/camera_info</depthImageCameraInfoTopicName>
  </plugin>
</sensor>
```

## گہرائی سے مطالعہ کے موضوعات

### فیزیکس انجین کا موازنہ

فیزیکس انجین کا انتخاب سمیولیشن فیڈلٹی اور استحکام کو نمایاں طور پر متاثر کرتا ہے۔ Gazebo چار انجنز کو سپورٹ کرتا ہے، ہر ایک کی منفرد خصوصیات ہیں۔

#### ODE (Open Dynamics Engine)

ODE Gazebo میں ڈیفالٹ فیزیکس انجین ہے۔ یہ جوائنٹ بائنڈریز کے لیے ڈنٹزگ یا مسلسل سالور کے ساتھ م约束 مبنی ڈائنمکس استعمال کرتا ہے۔

| خصوصیت | قیمت |
|---|---|
| سالور | ڈنٹزگ (درست) یا مسلسل (تیز) |
| رابطہ ماڈل | کولومب رگڑ اسپلٹ امپالس کے ساتھ |
| مضبوطی | تیز، اچھی طرح ٹیسٹ شدہ، درمیانی رابطے کے لیے مستحکم |
| کمزوری | سادہ رگڑ ماڈل، رولنگ رابطے میں دقت |
| بہترین | پہیہ والے روبوٹس، سادہ دو پائیں، مینیپولیشن ٹاسکس |

**اہم پیرامیٹرز:**
- `cfm` (Constraint Force Mixing): م约束 نرمی کو کنٹرول کرتا ہے۔ زیادہ قیمتیں جوائنٹس کو زیادہ نرم بناتی ہیں۔
- `erp` (Error Reduction Rate): کنٹرول کرتا ہے کہ جوائنٹ خرابیوں کو کتنا جاریانہ طریقے سے درست کیا جاتا ہے۔ ڈیفالٹ 0.2۔
- `contact_max_correcting_vel`: رابطہ پر میکس ویلوسٹی تصحیح۔
- `contact_surface_layer`: جلدی رابطے کی تشخیص کے لیے ٹکرانے کی جیومٹری کے گرد پتلی پردہ۔

#### Bullet

Bullet زیادہ پیچیدہ ٹکرانے کی تشخیص اور سافٹ بیڈی فیزیکس فراہم کرتا ہے۔

| خصوصیت | قیمت |
|---|---|
| سالور | سیریئل امپالس |
| رابطہ ماڈل | کولومب رگڑ کے ساتھ اسپلٹ امپالس |
| مضبوطی | بہتر رگڑ ماڈلنگ، سافٹ بیڈی سپورٹ، ریگڈول ڈائنمکس |
| کمزوری | بڑے سینز کے لیے ODE سے سست، کم پختہ ROS انٹیگریشن |
| بہترین | انسان نما لوکوموشن، بدلنے والی زمین، پیچیدہ رابطہ |

#### DART (Dynamic Animation and Robotics Toolkit)

DART امپالس مبنی طریقہ استعمال کرتا ہے اور کنیمیٹک ٹری کا مکمل ڈائنمکس ماڈل برقرار رکھتا ہے۔

| خصوصیت | قیمت |
|---|---|
| سالور | م约束 تثبیت کے ساتھ امپالس مبنی |
| رابطہ ماڈل | LCP یا PGS سالور کے ساتھ ٹھوس رابطہ |
| مضبوطی | درست ڈائنمکس، Skeleton API، ٹکرانے کی تشخیص کوالٹی |
| کمزوری | سست شروعات، چھوٹی کمیونٹی |
| بہترین | حیاتیاتی ماڈلنگ، درست انسان نما ڈائنمکس ریسرچ |

#### MuJoCo (Multi-Joint dynamics with Contact)

MuJoCo کنٹرول اور رینفورسمنٹ لرننگ کے لیے بہترین ہے۔ یہ ایک ہموار م约束 ماڈل استعمال کرتا ہے اور رابطے سے بھرپور سمیولیشنز کے لیے نہایت تیز ہے۔

| خصوصیت | قیمت |
|---|---|
| سالور | نیوٹن سالور کے ساتھ ہموار رابطہ |
| رابطہ ماڈل | ہموار تقریب کے ساتھ آرام دہ ٹھوس رابطہ |
| مضبوطی | رابطے سے بھرپور ٹاسکس کے لیے سب سے تیز، RL کے لیے بہترین، درست رگڑ |
| کمزوری | کمرشل لائسنس (ریسرچ کے لیے مفت)، محدود رنڈرنگ |
| بہترین | رینفورسمنٹ لرننگ، چست مینیپولیشن، انسان نما لوکوموشن ریسرچ |

### سینسر سمیولیشن فیڈلٹی اور نوائز ماڈلز

سمیولیٹڈ سینسرز مفید ہونے کے لیے حقیقی نوائز شامل کرنا ضروری ہے۔ ایک کامل سینسر ایسے الگورتھم تیار کرتا ہے جو حقیقی دنیا میں ناکام ہو جاتے ہیں۔

#### گاؤسی نوائز ماڈل

زیادہ تر سینسر پلگ انز اضافی گاؤسی نوائز کو سپورٹ کرتے ہیں:

```
measured_value = true_value + N(μ, σ²)
```

عام نوائز پیرامیٹرز:

| سینسر | پیرامیٹر | عام قیمت | اکائیاں |
|---|---|---|---|
| IMU کونی رفتار | σ | 0.0017 | rad/s |
| IMU لکیری acceleration | σ | 0.0196 | m/s² |
| کیمرہ پکسل شدت | σ | 0.007 | normalized |
| LiDAR رینج | σ | 0.01 | m |
| ڈیپتھ کیمرہ گہرائی | σ | 0.005 | m |

#### عارضی نوائز ذرائع

- **جٹر**: حقیقی اپ ڈیٹ ریٹ میں تغیر۔ 30 Hz کا کیمرہ حقیقی میں 28-32 Hz پر publish کر سکتا ہے۔
- **لیٹنسی**: تصویر کی کیپچر اور ٹاپک publish کے درمیان وقت۔ عام طور پر ریزولوشن اور پروسیسنگ کے مطابق 10-50 ms۔
- **چھوڑے گئے فریم**: پروسیسنگ لوڈ کی وجہ سے کبھی کبھی غائب پیغامات۔

#### خلائی نوائز ذرائع

- **歪曲**: حقیقی کیمرز میں لینس歪曲 (برل، پنکشن)۔ Gazebo `<distortion>` ٹیگ کے ذریعے اسے سمیولیٹ کر سکتا ہے۔
- **ریزولوشن حدود**: پکسل ڈینسٹی کم از کم قابل تشخیص چیز کے سائز کو متاثر کرتی ہے۔
- **فیلڈ آف ویو رول آف**: حقیقی لینس کناروں پر وضاحت کھو دیتے ہیں۔

#### ڈومین رنڈمائزیشن تکنیکیں

ڈومین رنڈمائزیشن ٹریننگ اپیسوڈز میں سمیولیشن پیرامیٹرز میں تبدیلی کرتا ہے تاکہ پالیسیز ریئلٹی گیپس کے خلاف مضبوط ہو سکیں:

- **بصری رنڈمائزیشن**: ٹیکسچر رنگز، لائٹنگ شدت، اور شیڈو نرمی رنڈمائز کریں۔
- **فیزیکس رنڈمائزیشن**: رگڑ کے معاملات (±20%)، ماس (±10%)، جوائنٹ ڈیمپنگ (±30%) میں تبدیلی کریں۔
- **سینسر رنڈمائزیشن**: نوائز کی سطحیں، اپ ڈیٹ ریٹس، اور لیٹنسی میں تبدیلی کریں۔
- **ماحولی رنڈمائزیشن**: فلور رگڑ، رکاوٹ کی پوزیشنز، اور لائٹنگ کی سمت رنڈمائز کریں۔

### ٹکرانے کی جیومٹری بمقابلہ بصری جیومٹری ٹریڈ آفس

بصری جیومٹری بیان کرتی ہے کہ روبوٹ کیسا دکھائی دیتا ہے۔ ٹکرانے کی جیومٹری بیان کرتی ہے کہ فیزیکس انجین رابطے کیسے گنتا ہے۔ یہ تقریباً ہمیشہ مختلف ہونی چاہیں۔

#### ٹکرانے کی جیومٹری کو سادہ کیوں کریں؟

- **کارکردگی**: فیزیکس انجنز ہر ٹکرانے کی شکل کے جوڑے کے درمیان رابطے چیک کرتے ہیں۔ ہزاروں مثلثوں والے پیچیدہ میشز رابطے کی تشخیص کو نمایاں طور پر سست کر دیتے ہیں۔
- **استحکام**: گودھردار میشز انٹرپنیٹریشن اور ٹنلنگ کا سبب بن سکتے ہیں۔ محدب پلے اور پرائمٹیوز (بکس، ہوے، سلنڈرز) نمبری طور پر مستحکم ہیں۔
- **درستگی**: میش ٹکرانے پتلی خصوصیات کو چھوڑ سکتے ہیں۔ پرائمٹیوز قابل پیشگوئی، تحلیلی طور پر گنے جانے والے رابطہ پوائنٹس فراہم کرتے ہیں۔

#### عام سادہ کاری کی حکمت عملیاں

| اصل جیومٹری | ٹکرانے کی تقریب | ٹریڈ آف |
|---|---|---|
| انگلیوں والا میش بازو | ہر انگلی کے لیے کیپسول، بازو کے لیے سلنڈر | انگلی کی سطح کی درستگی کھو دیتا ہے، رفتار بڑھاتا ہے |
| ٹریڈ پیٹرن والا جوتا | ہموار بکس | تلوے کی جیومٹری کھو دیتا ہے، زمین کے رابطے میں استحکام بڑھاتا ہے |
| چہرے کی خصوصیات والا سر | ہوے | چہرے کے ٹکرانے کو کھو دیتا ہے، عام فیز میں کارکردگی بڑھاتا ہے |
| مڑی ٹانگوں والا میز | بکس ٹاپ + سلنڈر ٹانگیں | ٹانگوں کی گولائی کھو دیتی ہے، رابطے کا استحکام بڑھاتا ہے |

#### محدب ڈیکمپوژیشن

گودھردار میشز کے لیے جن کو زیادہ فیڈلٹی کی ضرورت ہے، محدب ڈیکمپوژیشن ٹولز (V-HACD، CoACD) ایک میش کو محدب ٹکڑوں میں توڑ دیتے ہیں:

```
# Using CoACD for convex decomposition
pip install coacd
python -c "
import coacd
mesh = coacd.Mesh('robot_hand.obj')
parts = coacd.coacd(
    mesh,
    max_convex_hull=16,
    preprocess_mode='auto',
    resolution=500
)
for i, part in enumerate(parts):
    part.export(f'collision_part_{i}.obj')
"
```

### دنیا بنانے کی بہترین مشاہدات

#### لے آؤٹ کے اصول

1. **سادگی سے شروع کریں**: ہموار فلور اور چند پرائمٹیوز سے شروع کریں۔ پیچیدگی صرف بنیادی سناریو کام کرنے پر شامل کریں۔
2. **حقیقی ابعاد استعمال کریں**: انسان دروازے 0.8 میٹر چوڑے ہوتے ہیں۔ معیاری میز کی اونچائی 0.75 میٹر ہے۔ راہیں 1.2-1.8 میٹر چوڑی ہیں۔
3. **واضح حدود بیان کریں**: دیواریں کیمرہ فرسٹم سے آگے بڑھنی چاہیں تاکہ ایجنٹس خالی جگہ نہ دیکھ سکیں۔
4. **ادراک کے لیے ٹیکسچر**: مختلف سطحوں کے لیے منفرد ٹیکسچرز استعمال کریں تاکہ ویژن الگورتھم انہیں ممتاز کر سکیں۔

#### فیزیکس دنیا کنفیگریشن

- **ٹائم اسٹیپ**: 0.001 s (1 kHz) روبوٹکس کے لیے معیاری ہے۔ سست ٹائم اسٹیپس تیز ڈائنمکس چھوڑ دیتے ہیں۔ تیز اسٹیپس کمپیوٹنگ ضائع کرتے ہیں۔
- **سالور iterations**: ODE کے لیے 50-100 iterations۔ زیادہ iterations رابطے کے استحکام کو بہتر بناتے ہیں لیکن کمپیوٹنگ بڑھاتے ہیں۔
- **ERP/CFM ٹیوننگ**: سخت تر جوائنٹس کے لیے ERP بڑھائیں۔ زیادہ لچکدار (اسپرنگی) رویے کے لیے CFM بڑھائیں۔
- **رابطہ پیرامیٹرز**: حقیقی پن کے لیے ہر مٹیریل جوڑے کے لیے رگڑ، اونچا، اور زیادہ سے زیادہ تصحیح ویلوسٹی ایڈجسٹ کریں۔

#### عام دنیا کی اشیاء

| شی | مقصد | فیزیکس ملاحظات |
|---|---|---|
| میزیں | مینیپولیشن ٹاسکس | بھاری اشیاء کو سپورٹ کرنا ضروری، اعلیٰ رگڑ سطح |
| کرسیاں | نیویگیشن رکاوٹیں | پیچیدہ جیومٹری، محدب ڈیکمپوژیشن استعمال کریں |
| دروازے | کمرے کے درمیان عبور | حدود کے ساتھ حنگ جوائنٹ، ٹرگر زونز |
| ڈھلے | ریچھ مارنے کا ٹیسٹ | ہموار میش، لٹھڑنے سے روکنے کے لیے اعلیٰ رگڑ |
| سیڑھیاں | کھڑی نیویگیشن چیلنج | قدیم قد 0.15-0.20 میٹر، تھڑے کی گہرائی 0.25-0.30 میٹر |
| تنگ راستے | راستہ منصوبہ بندی پابندیاں | انسان نما کے لیے چوڑائی 0.8-1.0 میٹر |
| حرکتی رکاوٹیں | متحرک سے بچنا | ویلوسٹی کمانڈز لاگو کریں، ٹکرانے کے ٹرگرز |

### بڑے سینز کے لیے کارکردگی بہتری

#### تفصیل کی سطح (LOD)

بعید کی اشیاء کے لیے بصری جیومٹری کی پیچیدگی کم کریں۔ Gazebo SDF میں `<lod>` عنصر کے ذریعے LOD کو سپورٹ کرتا ہے:

```xml
<link name="table_link">
  <visual name="high_detail">
    <geometry>
      <mesh uri="model://table_high.dae"/>
    </geometry>
    <lod>0 20</lod>
  </visual>
  <visual name="low_detail">
    <geometry>
      <mesh uri="model://table_low.dae"/>
    </geometry>
    <lod>20 100</lod>
  </visual>
</link>
```

#### خلائی تقسیم

Gazebo عام فیز ٹکرانے کی تشخیص کے لیے آکٹری مبنی خلائی تقسیم استعمال کرتا ہے۔ یقینی بنائیں کہ اسٹیٹک اشیاء `<static>true</static>` کے ساتھ نشان لگائی گئی ہیں تاکہ انجین ان کے باؤنڈنگ باکس ہر فریم پر دوبارہ نہ گنے۔

#### رابطہ فلٹرنگ

رابطہ فلٹرز کا استعمال کرتے ہوئے محدود کریں کہ کون سے لینکس آپس میں ٹکرا سکتے ہیں:

```xml
<contact>
  <collision name="left_foot_collision">
    <filter>
      <minus/>
      <group name="self_collide_group"/>
    </filter>
  </collision>
</contact>
```

#### پیرالل سمیولیشن

Isaac Sim اور NVIDIA کے GPU فیزیکس انجنز وسیع پیراللائزیشن کو سپورٹ کرتے ہیں۔ CPU مبنی Gazebo کے لیے:

- علیحدہ تھریڈز پر متعدد آزاد دنیاں چلائیں۔
- غیر اہم سینسرز کے لیے سینسر ریزولوشن کم کریں۔
- جن سینسرز کو ہر فریم کی ضرورت نہیں ان کے لیے `<always_on>false</always_on>` استعمال کریں۔

#### میموری انتظام

- جہاں ممکن ہو میشز کی بجائے پرائمٹیو شکلیں (بکس، سلنڈرز، ہوے) استعمال کریں۔
- ٹیکسچر میپز کو 1024x1024 یا اس سے چھوٹا کریں۔
- دنیا فائل سے غیر استعمال شدہ ماڈلز ہٹائیں۔
- مکمل ماڈل ڈیٹابیس لوڈ کرنے سے بچیں؛ صرف ضروری ماڈلز کا حوالہ دیں۔

## چھوٹا کیس اسٹڈی: اپارٹمنٹ اسسٹنٹ

ایک انسان نما اسسٹنٹ کو میز سے شیلف تک بوتل لے جانی ہوتی ہے۔ سمیولیشن میں بیان کریں:

- بازو، بنیاد، سینسرز، اور ٹکرانے کی جیومٹری والا ایک روبوٹ ماڈل۔
- فرنیچر، تنگ راستوں، اور ہدف شیلفز والا ایک کمرہ۔
- ڈیپتھ، کیمرہ، اور IMU ڈیٹا کے لیے سینسر اسٹریمز۔
- کامیابی کے معیارات: کوئی ٹکرانا نہیں، شی شناخت ہو گئی، شی پہنچا دیا گیا، روبوٹ مستحکم ہے۔
- ناکامی کی حالتیں: بند راستہ، کم اعتماد والی شی کی تشخیص، نہ پہنچنے والی شیلف، غیر مستحکم پوزیشن۔

### تفصیلی ٹیسٹ میٹرکس

| ٹرائی | شرط | متوقع عمل |
|---|---|---|
| 1 | صاف راستہ، معلوم شی | نیویگیٹ کریں، پکڑیں، پہنچائیں |
| 2 | کرسی سے بند تنگ راستہ | راستہ دوبارہ منصوبہ بندی کریں، ٹکرانے سے بچیں |
| 3 | شی کو دوسری میز پر لے جایا گیا | تشخیص اپ ڈیٹ کریں، نئے مقام پر نیویگیٹ کریں |
| 4 | کم روشنی کی حالت | کم اعتماد کے ساتھ تشخیص برقرار رکھیں |
| 5 | انسان سینز سے گزرتا ہے | رکیں، راستہ دیں، صاف ہونے پر دوبارہ شروع کریں |
| 6 | شی پہنچ سے باہر ہے | ناکامی کی اطلاع دیں، انسانی مدد کی درخواست کریں |
| 7 | لیسدار فلور سطح | رفتار کم کریں، توازن تصحیحات بڑھائیں |

## سم ٹو ریئل ٹرانسفر تکنیکیں

سمیولیشن اور فیزیکل دنیا کے درمیان ریئلٹی گپ سم ٹرینڈ پالیسیز کو ڈیپلو کرنے میں بنیادی چیلنج ہے۔

### سسٹم پہچان

سسٹم پہچان (SysID) حقیقی ہارڈیور کی خصوصیات پڑھتا ہے اور انہیں سمیولیشن میں نقالہ بناتا ہے:

1. **ماس اور انرٹیا**: ہر لینک کا وزن کریں اور جیومٹری یا ماڈلز سے انرٹیا گنیں۔
2. **رگڑ کے معاملات**: حقیقی سطحوں پر گھسیٹ کے ٹیسٹ سے ساکن اور حرکتی رگڑ پڑھیں۔
3. **جوائنٹ رگڑ**: معلوم ٹارک لاگو کریں اور جوائنٹ جائے پذیرائی پڑھیں۔
4. **سینسر کیلبریشن**: انٹرنسیک کیلبریشن (کیمرہ انٹرنسیک، IMU بائیاس) اور ایکسٹرنسیک کیلبریشن (سینسر ٹو روبوٹ ٹرانسفارمز) چلائیں۔

### ڈومین ایڈاپٹیشن حکمت عملیاں

- **ٹیچر-سٹیڈنٹ ٹریننگ**: سمیولیشن میں م特权 معلومات (گراؤنڈ ٹروتھ اسٹیٹ) کے ساتھ ٹرین کریں، پھر ایک سٹیڈنٹ پالیسی میں جام کریں جو صرف حقیقی دنیا میں قابل مشاہہ ان پٹس استعمال کرتی ہے۔
- **سم ٹو ریئل فائن ٹیوننگ**: سمیولیشن میں پیش تربیت کریں، پھر کم مقدار کے حقیقی دنیا ڈیٹا پر فائن ٹیون کریں۔
- **باقی پالیسی لرننگ**: سم ٹرینڈ بنیادی پالیسی استعمال کریں اور حقیقی ڈیٹا سے باقی تصحیح سیکھیں۔

### ڈومین رنڈمائزیشن چیک لسٹ

| پیرامیٹر | رنڈمائزیشن رینج | وجہ |
|---|---|---|
| زمین کی رگڑ | 0.5-1.2 | فلور مٹیریلز میں وسیع فرق |
| جوائنٹ ڈیمپنگ | نامنی کے ±30% | بنیادی جائے پذیرائی |
| موٹر طاقت | نامنی کے ±15% | بیٹری وولٹیج اور درجہ حرارت کے اثرات |
| سینسر نوائز | نامنی کے ±50% | ماحولیہ حالتیں نوائز کو متاثر کرتی ہیں |
| شی کا ماس | نامنی کے ±20% | حقیقی اشیاء کا وزن نامعلوم |
| لائٹنگ شدت | 0.5-2.0x | انڈور/آؤٹ ڈور لائٹنگ میں تغیر |
| کیمرہ رنگ بیلنس | فی چینل ±30% | مختلف کیمرے، وائٹ بیلنس سیٹنگز |
| گریوٹی | 9.78-9.83 m/s² | اونچائی اور عرض کے اثرات |

### حقیقی ڈیپلویمنٹ سے پہلے سمیولیشن میں جانچ

1. مکمل ڈومین رنڈمائزیشن کے ساتھ 100+ سمیولیشن اپیسوڈز چلائیں۔
2. کامیابی کی شرح، ٹکرانے کی تعدد، اور ٹاسک تکمیل کا وقت پڑھیں۔
3. بدترین صورتحال (انتہائی نوائز، زیادہ سے زیادہ رگڑ میں تغیر) ٹیسٹ کریں۔
4. تصدیق کریں کہ کوئی بھی رنڈمائزیشن سیڈ تباہ کار ناکامی کا سبب نہیں بناتا۔
5. حقیقی ہارڈیور پر ایک نگران اور ایمرجنسی اسٹاپ تیار رکھتے ہوئے ڈیپلو کریں۔

## عام سمیولیشن خرابیاں

### 1. انٹرپنیٹریشن اور دھماکہ

**علامت**: روبوٹ کے لینکس ایک دوسرے سے گزر جاتے ہیں، پھر فیزیکس انجین بڑی تصحیح نیروں لاگو کرتا ہے جس سے ماڈل پھیلا جاتا ہے۔

**وجہ**: ٹائم اسٹیپ بہت بڑا، رابطہ پیرامیٹرز غلط طریقے سے کنفیگر کیے گئے، یا ٹکرانے کی جیومٹری گودھردار ہے۔

** fix **: `max_step_size` کو 0.0005 s تک کم کریں، سالور iterations بڑھائیں، محدب ٹکرانے کی جیومٹری استعمال کریں۔

### 2. فلوٹنگ بیس ان اسٹیبلٹی

**علامت**: روبوٹ زمین کے رابطے کے بغیر فری اسپیس میں بہتا ہے یا ہلتا ہے۔

**وجہ**: غائب فلور پلین، غلط گریوٹی کی سمت، یا URDF کوآرڈینیٹ فریم کی خرابیاں۔

** fix **: تصدیق کریں کہ فلور پلین لوڈ ہوا ہے، `<gravity>` سمت منفی Z ہے، URDF اصلوں کی تصدیق کریں۔

### 3. جوائنٹ لیمٹ خلاف ورزیاں

**علامت**: روبوٹ جوائنٹس فیزیکل حدود سے آگے مڑتے ہیں یا حدود پر ہلتے ہیں۔

**وجہ**: URDF میں جوائنٹ لیمٹس بیان نہیں کیے گئے، یا PID gain بہت جاریانہ ہیں۔

** fix **: ہر جوائنٹ کے لیے `<limit>` عناصر شامل کریں، PID کنٹرولرز ٹیون کریں، جوائنٹ ڈیمپنگ شامل کریں۔

### 4. سینسر الیزنگ

**علامت**: ادراک الگورتھم سمیولیشن میں کام کرتے ہیں لیکن حقیقی دنیا میں ناکام ہو جاتے ہیں۔

**وجہ**: سمیولیٹڈ سینسرز بالکل صحیح انٹروالز پر اپ ڈیٹ ہوتے ہیں، کوئی جٹر یا چھوڑے گئے فریم نہیں۔

** fix **: سینسر اپ ڈیٹ ریٹس میں عارضی نوائز شامل کریں، کبھی کبھی فریم ڈراپس سمیولیٹ کریں، لیٹنسی شامل کریں۔

### 5. گریوٹی اور انرٹیا میں عدم مطابقت

**علامت**: روبوٹ فوری گر جاتا ہے یا سست چلتا ہے۔

**وجہ**: انرٹیا کی قیمتیں غلط ہیں، یا ماس حقیقی نہیں ہے۔

** fix **: درست انرٹیا ٹینسرز گنے کے لیے ماڈلز استعمال کریں، یا ہارڈیور سے پڑھی گئی قیمتیں استعمال کریں۔

### 6. URDF کوآرڈینیٹ فریم خرابیاں

**علامت**: روبوٹ کے حصے غلط مقامات پر نظر آتے ہیں یا TF ٹری ٹوٹ جاتی ہے۔

**وجہ**: جوائنٹس یا لینکس میں غلط `<origin>` قیمتیں۔

** fix **: پہلے URDF کو RViz میں دکھائیں، ہر جوائنٹ اصل کی روبوٹ کی کنیمیٹک اسپیفیکیشن کے خلاف تصدیق کریں۔

### 7. ماڈل لوڈنگ خرابیاں

**علامت**: Gazebo "ماڈل نہیں ملا" رپورٹ کرتا ہے یا شروعات پر کریش ہو جاتا ہے۔

**وجہ**: ماڈل پاتھ غلط ہیں، میشز غائب ہیں، یا Gazebo ماڈل ڈیٹابیس کنفیگر نہیں ہے۔

** fix **: مطلق پاتھ استعمال کریں، یقینی بنائیں کہ تمام میش فائلیں موجود ہیں، `GAZEBO_MODEL_PATH` ماحولیہ متغیر سیٹ کریں۔

## عملی لیب

<div className="lab-box">
<h3>لیب: ڈیجیٹل ٹون بیان کریں</h3>
<p>ایک روبوٹ ٹاسک کے لیے ٹیسٹ دنیا ڈیزائن کریں۔ روبوٹ ماڈل، کمرے کا لے آؤٹ، سینسرز، ٹیسٹ سناریو، پاس کے معیارات، اور ناکامی کے معیارات شامل کریں۔</p>
</div>

## کوئز

### اپنی سمجھ کی جانچ کریں

1. URDF کیا بیان کرتا ہے؟
1. ٹکرانے کی میشز اہم کیوں ہیں؟
1. سینسرز کی سمیولیشن میں جانچ کا ایک فائدہ کیا ہے؟
1. سمیولیشن کے نتائج حقیقی دنیا میں کیوں ناکام ہو سکتے ہیں؟
1. Gazebo کے چار فیزیکس انجنز کے نام بتائیں۔
1. ڈومین رنڈمائزیشن کیا ہے؟
1. ٹکرانے کی جیومٹری بصری جیومٹری سے سادہ کیوں ہونی چاہیے؟
1. روبوٹکس سمیولیشن کے لیے تجویز کردہ ٹائم اسٹیپ کیا ہے؟
1. URDF میں `<inertial>` عنصر کا مقصد کیا ہے؟
1. ROS TCP کنیکٹر براہ راست ROS ٹاپک سبسکرپشن سے کیسے مختلف ہے؟

### جوابات کلید

1. ایک روبوٹ کے لینکس، جوائنٹس، جیومٹری، اور متعلقہ فیزیکل وضاحت۔
1. یہ سمیولیٹر کو رابطے کی تشخیص میں مدد کرتے ہیں اور ناممکن حرکت کو روکتے ہیں۔
1. یہ ادراک اور نیویگیشن پائپ لائنز کو ہارڈیور دستیاب ہونے سے پہلے جانچنے کی اجازت دیتے ہیں۔
1. حقیقت میں نوائز، رگڑ میں فرق، لائٹنگ میں تبدیلیاں، کیلبریشن خرابیاں، اور ہارڈیور کی حدود شامل ہیں۔
1. ODE، Bullet، DART، اور MuJoCo۔
1. ایک تکنیک جو تربیت اپیسوڈز میں سمیولیشن پیرامیٹرز (فیزیکس، بصری، سینسرز) میں تبدیلی کرتی ہے تاکہ پالیسیز ریئلٹی گیپس کے خلاف مضبوط ہو سکیں۔
1. پیچیدہ میشز رابطے کی تشخیص کو سست کرتے ہیں اور عدم استحکام کا سبب بن سکتے ہیں۔ سادہ پرائمٹیوز (بکس، ہوے، کیپسولز) تیز اور نمبری طور پر زیادہ مستحکم ہیں۔
1. معیاری روبوٹکس ٹاسکس کے لیے 0.001 s (1 kHz)۔
1. یہ ماس اور 3x3 انرٹیا ٹینسر بیان کرتا ہے جو ڈائنمکس انجین کو سمیولیشن کے دوران قوتیں اور ٹارک گنے کے لیے استعمال کرتا ہے۔
1. TCP کنیکٹر Unity اور ROS 2 کے درمیان نیٹ ورک ساکٹ پر ڈیٹا اسٹریم کرتا ہے، جبکہ براہ راست سبسکرپشن ایک ہی پروسیس کے اندر ROS 2 DDS مڈل ویئر استعمال کرتا ہے۔

## لغت

| اصطاح | وضاحت |
|---|---|
| **URDF** | Unified Robot Description Format۔ ایک XML فارمیٹ جو روبوٹ کی کنیمیٹکس، ڈائنمکس، اور بصری/ٹکرانے کی جیومٹری کو لینکس اور جوائنٹس کی ٹری کے طور پر بیان کرتا ہے۔ |
| **SDF** | Simulation Description Format۔ ایک XML فارمیٹ جو Gazebo فیزیکس، لائٹنگ، اور ماڈلز سمیت مکمل سمیولیشن دنیاں بیان کرنے کے لیے استعمال ہوتا ہے۔ |
| **ڈیجیٹل ٹون** | فیزیکل سسٹم کی ایک سمیولیٹڈ نمائندگی جو حقیقی دنیا ڈیپلویمنٹ سے پہلے یا اس کے ساتھ ٹیسٹنگ، ٹریننگ، اور مانیٹرنگ کے لیے استعمال ہوتی ہے۔ |
| **ڈومین رنڈمائزیشن** | سمیولیشن پیرامیٹرز (رگڑ، لائٹنگ، نوائز، ماس) میں اپیسوڈز میں تبدیلی تاکہ سیکھی گئی پالیسیز سم ٹو ریئل گیپ کے خلاف مضبوط ہو سکیں۔ |
| **سم ٹو ریئل گیپ** | سمیولیٹڈ اور حقیقی دنیا کے رویے میں فرق جو ماڈل نہ کی گئی فیزیکس، سینسر نوائز، اور ماحولیہ متغیرات کی وجہ سے ہوتا ہے۔ |
| **ODE** | Open Dynamics Engine۔ ریگڈ بیڈی ڈائنمکس کو سمیولیٹ کرنے کے لیے ایک C++ لائبریری، Gazebo میں ڈیفالٹ فیزیکس انجین۔ |
| **DART** | Dynamic Animation and Robotics Toolkit۔ مربوط ٹھوس جسم سسٹمز کی درست سمیولیشن پر مرکوز ایک ڈائنمکس لائبریری۔ |
| **MuJoCo** | Multi-Joint dynamics with Contact۔ کنٹرول اور رینفورسمنٹ لرننگ کے لیے بہترین فیزیکس انجین جو تیز رابطہ سمیولیشن فراہم کرتا ہے۔ |
| **IMU** | Inertial Measurement Unit۔ ایک سینسر جو ایسلریٹومیٹرز اور جائیرواسکوپس کو ملا کر لکیری acceleration اور کونی رفتار پڑھتا ہے۔ |
| **LiDAR** | Light Detection and Ranging۔ ایک سینسر جو لیزر پلیسز کا استعمال کرتے ہوئے ماحول کی اشیاء کے فاصلے پڑھتا ہے، 3D پوائنٹ کلاؤڈز تیار کرتا ہے۔ |
| **TF ٹری** | Transform tree۔ robot_state_publisher کے ذریعے publish کی جانے والی کوآرڈینیٹ فریم تعلقات کی درجہ بندی نمائندگی۔ |
| **محدب ڈیکمپوژیشن** | ٹکرانے کی جیومٹری کے طور پر استعمال کے لیے گودھردار میش کو متعدد محدب ٹکڑوں میں توڑنا۔ |
| **سسٹم پہچان** | حقیقی ہارڈیور کی خصوصیات (ماس، رگڑ، ڈیمپنگ) پڑھنے اور انہیں سمیولیشن میں نقالہ بنانے کا عمل۔ |
| **ROS TCP کنیکٹر** | ایک نیٹ ورک بریج جو Unity اور ROS 2 ورک اسپیس کے درمیان TCP ساکٹس پر ROS 2 ٹاپکس اسٹریم کرتا ہے۔ |

## حفاظت اور ہارڈیور نوٹس

<div className="safety-box">
<h3>سمیولیشن ثبوت ہے، اجازت نہیں</h3>
<p>گزری ہوئی سمیولیشن ثابت نہیں کرتی کہ روبوٹ محفوظ ہے۔ فیزیکل ڈیپلویمنٹ کو اب بھی مقامی حفاظتی چارے، ایمرجنسی اسٹاپس، کیلبریٹڈ سینسرز، اور محتاط رفتار کی حدود کی ضرورت ہوتی ہے۔</p>
</div>
