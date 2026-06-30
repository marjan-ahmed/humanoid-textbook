---
sidebar_position: 1
title: Digital Twins with Gazebo and Unity
description: Physics simulation with Gazebo and Unity, URDF/SDF robot descriptions, collision modeling, sensors, depth cameras, LiDAR, IMUs, and testable digital twin environments.
keywords: [Gazebo, Unity, digital twins, URDF, SDF, physics simulation, robot simulation, LiDAR, IMU, ROS 2, Isaac Sim, sim-to-real transfer, ODE, Bullet, DART, MuJoCo, sensor noise models, domain randomization, collision geometry, inertial properties, launch files, TCP connector]
---

import PersonalizationToolbar from '@site/src/components/Personalization/PersonalizationToolbar';

# Gazebo aur Unity ke saath Digital Twins

<PersonalizationToolbar chapterSlug="simulation/digital-twins-gazebo-unity" />

## Seekhne ke nataij

- Bayan karein ke physical robot ki deployment se pehle simulation kyun zaroori hai.
- Gazebo physics simulation aur Unity visualization ke kirdar ka muwazana karein.
- Pehchanein ke URDF, SDF, LiDAR, depth cameras, aur IMU robot testing ko kaise madad karte hain.
- Ek humanoid task ke liye simulation test design karein.
- URDF aur SDF files tayar karein jo robot ki kinematics, dynamics, aur sensor placement bayan karti hain.
- Sensor plugins ko haqeeqi noise models, update rates, aur field-of-view pabandiyon ke saath configure karein.
- ODE, Bullet, DART, aur MuJoCo ke darmiyan mukhtalif robot morphology ke liye physics engine tradeoffs ka tajziya karein.
- Reality gap ko kam karne ke liye domain randomization aur sim-to-real transfer techniques lagu karein.
- Interpenetration, floating-base instability, aur sensor aliasing samet aam simulation kharabiyon ki islah karein.

## Tasawwur ki wazahat

### Hardware se pehle simulation kyun

Digital twin robot, mahol, ya interaction ki simulated copy hai. Yeh haqeeqat ki bilkul mutabiq nahi hoti. Yeh ek controlled test space hai jahan seekhne wale machine ke shuru hone se pehle masail bayaan kar sakte hain. Simulation fori hardware deployment ke muqablay mein teen ahem fawaid faraham karta hai:

1. **Hifazat** -- Aap failure modes (joint over-torque, unstable gaits, collision recovery) ko hardware tabah kiye ya insaanon ko zakhmi kiye baghair test kar sakte hain.
2. **Takarar pazeeri** -- Har run ikthai shuruati halat se shuru hota hai, jo aik variable ko alag karne wale controlled tajurbaat ko mumkin banata hai.
3. **Raftaar** -- Sauan test episodes computer cluster par parallel mein chal sakte hain, jo mahino ki physical testing ko ghanton mein compress kar dete hain.

### Gazebo: physics pehle wala simulator

Gazebo physics, takrana, gravity, robot descriptions, aur sensor simulation ke liye mufeed hai. Yeh khaas taur par robotics research ke liye design kiya gaya tha aur ROS aur ROS 2 ke saath dedicated bridge packages ke zariye natively integrate hota hai. Gazebo plugin-based architecture istemal karta hai: har sensor, physics engine, aur middleware integration ek load hone wala plugin hai. Yeh ise extensible banata hai lekin iska matlab yeh bhi hai ke configuration aksar taweel hoti hai.

Humanoid simulation ke liye ahem Gazebo salahiyatein:

- **Physics engines**: ODE (default), Bullet, DART, aur Simbody per-world select kiye ja sakte hain.
- **Sensor plugins**: Camera, depth camera, LiDAR (ray aur GPU), IMU, force-torque, contact sensor, GPS, aur magnetometer plugins standard Gazebo distributions ke saath aate hain.
- **Model database**: Community-maintained model repository pehle se bane robots, ashiya, aur mahol faraham karti hai.
- **ROS integration**: `gazebo_ros_pkgs` aur naya `ros_gz` bridge Gazebo aur ROS 2 nodes ke darmiyan do tarfa topic aur service communication faraham karta hai.

### Unity: high-fidelity visualization aur interaction

Unity high-fidelity visualization aur human-robot interaction scenes faraham kar sakta hai. Yeh asal mein games ke liye design kiye gaye real-time rendering engine par bana hai, jo ise visual quality, animation, aur VR/AR integration mein fayda deta hai. Lekin, Unity robotics ke liye design nahi kiya gaya tha, isliye physics aur ROS integration ko carefully setup ki zaroorat hoti hai.

Humanoid simulation ke liye ahem Unity salahiyatein:

- **URDF Importer**: Unity Robotics package URDF files parse karta hai aur joint controllers ke saath articulated robot GameObjects banata hai.
- **ROS TCP Connector**: Ek network-based bridge jo Unity aur ROS 2 workspace ke darmiyan TCP par ROS 2 topics (sensor data, joint states, commands) stream karta hai.
- **ML-Agents**: Reinforcement learning toolkit jo Unity maholon mein policies ki directly training ki ijazat deta hai.
- **HDRP rendering**: High Definition Render Pipeline photorealistic scenes tayar karta hai jo vision-based algorithms ki training ke liye mufeed hai.

### Isaac Sim: NVIDIA ka simulation platform

Isaac Sim NVIDIA Omniverse par bana photorealistic robotics simulation aur synthetic data generation faraham karta hai. Yeh physically accurate lighting aur reflections ke liye RTX ray tracing istemal karta hai. Isey RTX hardware ya munasib cloud GPU ki zaroorat hoti hai. Isaac Sim khaas taur par in ke liye mazboot hai:

- Perception models ki training ke liye synthetic data generation.
- GPU-accelerated physics ke saath baray paimane par parallel simulation.
- NVIDIA ke robotics stack (Isaac Lab, Isaac Cortex) ke saath integration.

Yeh teeno tools mil kar talib ilmon ko robotics ki mechanics aur tajurba dono ko samajhne mein madad karte hain.

## Visual model: simulation stack

<div className="visual-panel">
<div className="visual-flow">
<div className="flow-step"><span>Robot model</span>URDF, joints, links, inertia, collision geometry</div>
<div className="flow-step"><span>World model</span>Kamre, floors, ashiya, rukawatein, lighting</div>
<div className="flow-step"><span>Physics</span>Gravity, takrana, ragar, damping, joint limits</div>
<div className="flow-step"><span>Sensors</span>RGB camera, depth, LiDAR, IMU, force-torque</div>
<div className="flow-step"><span>Middleware</span>ROS 2 topics, services, actions, TF tree</div>
<div className="flow-step"><span>Test</span>Navigation, manipulation, locomotion, failure recovery</div>
</div>
</div>

## Gazebo aur Unity ka muwazana

| Tool | Mazboot kahan | Khabardar rahein |
|---|---|---|
| Gazebo | Physics, robot descriptions, sensors, ROS integration | Visual realism baghair izafi kaam ke limited ho sakti hai |
| Unity | Visual mahol, interaction scenes, human-facing simulation | Physics aur ROS integration ko carefully setup ki zaroorat |
| Isaac Sim | Photorealistic robotics simulation aur synthetic data | RTX hardware ya munasib cloud GPU ki zaroorat |

## Tafseeli URDF sakht

URDF (Unified Robot Description Format) ek XML-based format hai jo robot ko joints se jure links ke tree ke taur par bayan karta hai. Gazebo mein har humanoid robot ek URDF file se shuru hota hai.

### Minimal humanoid URDF misal

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
    <visual><geometry><cylinder radius="0.06" length="0.35"/></geometry></visual>
    <collision><geometry><cylinder radius="0.06" length="0.35"/></geometry></collision>
    <inertial>
      <mass value="5.0"/>
      <origin xyz="0 0 -0.175"/>
      <inertia ixx="0.02" ixy="0.0" ixz="0.0" iyy="0.02" iyz="0.0" izz="0.005"/>
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
    <visual><geometry><cylinder radius="0.05" length="0.35"/></geometry></visual>
    <collision><geometry><cylinder radius="0.05" length="0.35"/></geometry></collision>
    <inertial>
      <mass value="4.0"/>
      <origin xyz="0 0 -0.175"/>
      <inertia ixx="0.015" ixy="0.0" ixz="0.0" iyy="0.015" iyz="0.0" izz="0.004"/>
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
    <visual><geometry><box size="0.1 0.06 0.02"/></geometry></visual>
    <collision><geometry><box size="0.1 0.06 0.02"/></geometry></collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
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
    <visual><geometry><cylinder radius="0.06" length="0.35"/></geometry></visual>
    <collision><geometry><cylinder radius="0.06" length="0.35"/></geometry></collision>
    <inertial>
      <mass value="5.0"/>
      <origin xyz="0 0 -0.175"/>
      <inertia ixx="0.02" ixy="0.0" ixz="0.0" iyy="0.02" iyz="0.0" izz="0.005"/>
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
    <visual><geometry><cylinder radius="0.05" length="0.35"/></geometry></visual>
    <collision><geometry><cylinder radius="0.05" length="0.35"/></geometry></collision>
    <inertial>
      <mass value="4.0"/>
      <origin xyz="0 0 -0.175"/>
      <inertia ixx="0.015" ixy="0.0" ixz="0.0" iyy="0.015" iyz="0.0" izz="0.004"/>
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
    <visual><geometry><box size="0.1 0.06 0.02"/></geometry></visual>
    <collision><geometry><box size="0.1 0.06 0.02"/></geometry></collision>
    <inertial>
      <mass value="1.0"/>
      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>
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
    <visual><geometry><sphere radius="0.1"/></geometry></visual>
    <collision><geometry><sphere radius="0.1"/></geometry></collision>
    <inertial>
      <mass value="3.0"/>
      <inertia ixx="0.005" ixy="0.0" ixz="0.0" iyy="0.005" iyz="0.0" izz="0.005"/>
    </inertial>
  </link>

  <!-- Camera sensor mounted on head -->
  <gazebo reference="head">
    <sensor type="camera" name="head_camera">
      <update_rate>30</update_rate>
      <camera name="head_camera_sensor">
        <horizontal_fov>1.047</horizontal_fov>
        <image><width>640</width><height>480</height><format>R8G8B8</format></image>
        <clip><near>0.1</near><far>100.0</far></clip>
      </camera>
      <plugin name="head_camera_plugin" filename="libgazebo_ros_camera.so">
        <ros><namespace>/robot</namespace></ros>
        <frame_name>head</frame_name>
      </plugin>
    </sensor>
  </gazebo>
</robot>
```

### Ahem URDF elements ki wazahat

| Element | Maqsad |
|---|---|
| `<link>` | Kinematic chain mein ek thos jism jis mein visual, collision, aur inertial khususiyaat hain |
| `<joint>` | Do links ko qism (revolute, prismatic, fixed, continuous), axis, limits, aur dynamics ke saath jodta hai |
| `<visual>` | Rendering ke liye istemal hone wali zahiri shakal bayan karta hai |
| `<collision>` | Physics engine ke zariye contact detection ke liye geometry bayan karta hai |
| `<inertial>` | Dynamics engine ke zariye istemal hone wala mass aur 3x3 inertia tensor |
| `<gazebo>` | Sensor plugins, material colors, aur hawalaat ke liye Gazebo-specific extensions |

## SDF world file misal

SDF (Simulation Description Format) URDF se zyada expressive hai aur Gazebo worlds ka native format hai.

```xml
<?xml version="1.0" ?>
<sdf version="1.9">
  <world name="humanoid_test_world">
    <physics name="ode_physics" type="ode">
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
      <real_time_update_rate>1000</real_time_update_rate>
      <ode>
        <solver><type>dantzig</type><iters>50</iters><sor>1.3</sor></solver>
        <constraints>
          <cfm>0.0</cfm><erp>0.2</erp>
          <contact_max_correcting_vel>100.0</contact_max_correcting_vel>
          <contact_surface_layer>0.001</contact_surface_layer>
        </constraints>
      </ode>
    </physics>
    <gravity>0 0 -9.81</gravity>
    <magnetic_field>5.6e-06 1.68e-05 -4.94e-05</magnetic_field>
    <atmosphere type="atmospheric_pressure"/>
    <light type="directional" name="sun">
      <pose>0 0 10 0 0 0</pose>
      <diffuse>0.8 0.8 0.8 1</diffuse>
      <specular>0.2 0.2 0.2 1</specular>
      <attenuation><range>1000</range><constant>0.9</constant><linear>0.01</linear><quadratic>0.001</quadratic></attenuation>
      <direction>-0.5 0.1 -0.9</direction>
      <cast_shadows>true</cast_shadows>
    </light>
    <include><uri>model://ground_plane</uri></include>
    <model name="concrete_floor">
      <static>true</static>
      <link name="floor_link">
        <visual name="floor_visual">
          <geometry><plane><normal>0 0 1</normal><size>20 20</size></plane></geometry>
          <material><ambient>0.5 0.5 0.5 1</ambient><diffuse>0.5 0.5 0.5 1</diffuse></material>
        </visual>
        <collision name="floor_collision">
          <geometry><plane><normal>0 0 1</normal><size>20 20</size></plane></geometry>
          <surface>
            <friction><ode><mu>0.8</mu><mu2>0.8</mu2><fdir1>1 0 0</fdir1></ode></friction>
            <bounce><ode><bounce>0.1</bounce><bounce_velocity>0.1</bounce_velocity></ode></bounce>
            <contact><ode><max_contacts>10</max_contacts><layer>0.001</layer><max_vel>100</max_vel></ode></contact>
          </surface>
        </collision>
      </link>
    </model>
    <model name="table">
      <static>true</static>
      <pose>2.0 0.5 0 0 0 0</pose>
      <link name="table_top">
        <visual name="top_visual"><geometry><box size="1.0 0.6 0.02"/></geometry></visual>
        <collision name="top_collision"><geometry><box size="1.0 0.6 0.02"/></geometry></collision>
        <pose>0 0 0.75 0 0 0</pose>
      </link>
      <link name="leg_1">
        <visual name="leg1_vis"><geometry><cylinder radius="0.03" length="0.75"/></geometry></visual>
        <collision name="leg1_col"><geometry><cylinder radius="0.03" length="0.75"/></geometry></collision>
        <pose>0.4 0.2 0.375 0 0 0</pose>
      </link>
      <link name="leg_2">
        <visual name="leg2_vis"><geometry><cylinder radius="0.03" length="0.75"/></geometry></visual>
        <collision name="leg2_col"><geometry><cylinder radius="0.03" length="0.75"/></geometry></collision>
        <pose>-0.4 0.2 0.375 0 0 0</pose>
      </link>
    </model>
    <include>
      <uri>model://minimal_humanoid</uri>
      <pose>0 0 1.2 0 0 0</pose>
    </include>
  </world>
</sdf>
```

## Python ke zariye Gazebo mein robots paida karna

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
            self.get_logger().info(f'Spawned {robot_name}: {future.result().status_message}')
        else:
            self.get_logger().error(f'Failed to spawn {robot_name}: {future.exception()}')

def main():
    rclpy.init()
    spawner = RobotSpawner()
    xacro_file = os.path.join(os.getcwd(), 'src', 'my_robot', 'urdf', 'humanoid.urdf.xacro')
    spawner.spawn_from_xacro(xacro_file, 'minimal_humanoid', '/robot')
    spawner.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Gazebo simulation ke liye ROS 2 launch file

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
    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(os.path.join(gazebo_share, 'launch', 'gazebo.launch.py')),
        launch_arguments={'world': world_file}.items(),
    )
    robot_state_publisher = Node(
        package='robot_state_publisher', executable='robot_state_publisher',
        parameters=[{'robot_description': robot_description}], output='screen',
    )
    joint_state_publisher = Node(
        package='joint_state_publisher', executable='joint_state_publisher',
        name='joint_state_publisher', parameters=[{'use_sim_time': True}],
    )
    spawn_entity = Node(
        package='gazebo_ros', executable='spawn_entity.py',
        arguments=['-topic', 'robot_description', '-entity', 'minimal_humanoid', '-z', '1.2'],
        output='screen',
    )
    return LaunchDescription([gazebo, robot_state_publisher, joint_state_publisher, spawn_entity])
```

## Unity ROS TCP connector setup

ROS TCP Connector Unity aur ROS 2 workspace ke darmiyan do tarfa communication faraham karta hai.

### Unity-side setup (C# component)

```csharp
using Unity.Robotics.ROSTCPConnector;
using UnityEngine;

public class ROSBridgeSetup : MonoBehaviour
{
    [SerializeField] string rosIPAddress = "127.0.0.1";
    [SerializeField] int rosPort = 10000;

    void Awake()
    {
        ROSConnection.instance.Connect(rosIPAddress, rosPort);
    }

    void Start()
    {
        ROSConnection.instance.Subscribe<GeometryMsgsTwist>("/cmd_vel", CmdVelCallback);
        ROSConnection.instance.RegisterPublisher<SensorMsgsImage>("/unity/camera/image_raw");
    }

    void CmdVelCallback(GeometryMsgsTwist msg)
    {
        float linearSpeed = (float)msg.linear.x;
        float angularSpeed = (float)msg.angular.z;
    }
}
```

### ROS-side endpoint node

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

## Sensor plugin configuration

### Camera plugin (Gazebo)

```xml
<sensor type="camera" name="front_camera">
  <always_on>true</always_on>
  <update_rate>30</update_rate>
  <camera name="front_camera_sensor">
    <horizontal_fov>1.047</horizontal_fov>
    <image><width>1920</width><height>1080</height><format>R8G8B8</format></image>
    <clip><near>0.05</near><far>100.0</far></clip>
    <noise><type>gaussian</type><mean>0.0</mean><stddev>0.007</stddev></noise>
  </camera>
  <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
    <ros><namespace>/robot/sensors</namespace></ros>
    <frame_name>front_camera_link</frame_name>
    <image_topicName>/robot/sensors/camera/image_raw</image_topicName>
    <camera_info_topicName>/robot/sensors/camera/camera_info</camera_info_topicName>
  </plugin>
</sensor>
```

### GPU LiDAR plugin (Gazebo)

```xml
<sensor type="gpu_lidar" name="velodyne_vlp16">
  <always_on>true</always_on>
  <update_rate>20</update_rate>
  <lidar name="vlp16">
    <scan>
      <horizontal><samples>360</samples><resolution>1</resolution><min_angle>-3.14159</min_angle><max_angle>3.14159</max_angle></horizontal>
      <vertical><samples>16</samples><resolution>1</resolution><min_angle>-0.2618</min_angle><max_angle>0.2618</max_angle></vertical>
    </scan>
    <range><min>0.1</min><max>100.0</max></range>
    <noise><type>gaussian</type><mean>0.0</mean><stddev>0.01</stddev></noise>
  </lidar>
  <plugin name="velodyne_plugin" filename="libgazebo_ros_gpu_laser.so">
    <ros><namespace>/robot/sensors</namespace></ros>
    <topicName>/robot/sensors/velodyne/points</topicName>
    <frameName>velodyne_link</frameName>
  </plugin>
</sensor>
```

### IMU plugin (Gazebo)

```xml
<sensor type="imu" name="imu_sensor">
  <always_on>true</always_on>
  <update_rate>200</update_rate>
  <imu name="imu">
    <topicName>/robot/sensors/imu/data</topicName>
    <bodyName>base_link</bodyName>
    <referenceFrame>base_link</referenceFrame>
    <angular_velocity><noise type="gaussian"><mean>0.0</mean><stddev>0.0017</stddev></noise></angular_velocity>
    <linear_acceleration><noise type="gaussian"><mean>0.0</mean><stddev>0.0196</stddev></noise></linear_acceleration>
  </imu>
  <plugin name="imu_plugin" filename="libgazebo_ros_imu_sensor.so">
    <ros><namespace>/robot/sensors</namespace></ros>
    <topicName>/robot/sensors/imu/data_raw</topicName>
    <bodyName>base_link</bodyName>
    <frameName>imu_link</frameName>
  </plugin>
</sensor>
```

### Depth camera plugin (Gazebo)

```xml
<sensor type="depth" name="depth_camera">
  <always_on>true</always_on>
  <update_rate>30</update_rate>
  <camera name="depth_sensor">
    <horizontal_fov>1.047</horizontal_fov>
    <image><width>640</width><height>480</height><format>R8G8B8</format></image>
    <clip><near>0.1</near><far>10.0</far></clip>
    <noise><type>gaussian</type><mean>0.0</mean><stddev>0.005</stddev></noise>
  </camera>
  <plugin name="depth_camera_controller" filename="libgazebo_ros_depth_camera.so">
    <ros><namespace>/robot/sensors</namespace></ros>
    <frameName>depth_camera_link</frameName>
    <pointCloudTopicName>/robot/sensors/depth/points</pointCloudTopicName>
    <depthImageTopicName>/robot/sensors/depth/image_raw</depthImageTopicName>
    <depthImageCameraInfoTopicName>/robot/sensors/depth/camera_info</depthImageCameraInfoTopicName>
  </plugin>
</sensor>
```

## Gahraai se mutalea ke mawzuat

### Physics engine ka muwazana

Physics engine ke intekhab se simulation fidelity aur sthirta par zyada asar parta hai. Gazebo char engines ko support karta hai.

#### ODE (Open Dynamics Engine)

ODE Gazebo mein default physics engine hai.

| Khususiyat | Qeemat |
|---|---|
| Solver | Dantzig (durust) ya iterative (tez) |
| Contact model | Coulomb friction with split impulse |
| Mazbooti | Tez, achi tarah test ki gaya |
| Kamzori | Saada friction model |
| Behtareen | Wheeled robots, saada bipeds, manipulation tasks |

#### Bullet

Bullet zyada sophisticated collision detection aur soft-body physics faraham karta hai.

| Khususiyat | Qeemat |
|---|---|
| Solver | Sequential impulse |
| Contact model | Split impulse with Coulomb friction |
| Mazbooti | Behtareen friction modeling, soft body support |
| Kamzori | Baray scenes ke liye ODE se sust |
| Behtareen | Humanoid locomotion, deformable terrain |

#### DART (Dynamic Animation and Robotics Toolkit)

| Khususiyat | Qeemat |
|---|---|
| Solver | Impulse-based with constraint stabilization |
| Contact model | Rigid contact with LCP or PGS solver |
| Mazbooti | Durust dynamics, Skeleton API |
| Kamzori | Sust shuruat, chhoti community |
| Behtareen | Biomechanical modeling, humanoid dynamics research |

#### MuJoCo (Multi-Joint dynamics with Contact)

| Khususiyat | Qeemat |
|---|---|
| Solver | Newton solver ke saath smooth contact |
| Contact model | Relaxed rigid contact with smooth approximation |
| Mazbooti | Contact-heavy tasks ke liye sab se tez |
| Kamzori | Commercial license, limited rendering |
| Behtareen | Reinforcement learning, dexterous manipulation |

### Sensor simulation fidelity aur noise models

Simulated sensors mufeed hone ke liye haqeeqi noise shamil karna zaroori hai.

#### Gaussian noise model

`
measured_value = true_value + N(mu, sigma^2)
`

| Sensor | Parameter | Aam qeemat | Ikaaiyan |
|---|---|---|---|
| IMU angular velocity | sigma | 0.0017 | rad/s |
| IMU linear acceleration | sigma | 0.0196 | m/s2 |
| Camera pixel intensity | sigma | 0.007 | normalized |
| LiDAR range | sigma | 0.01 | m |
| Depth camera depth | sigma | 0.005 | m |

#### Arzi noise zaraiye

- **Jitter**: Haqeeqi update rate mein tabdeeli.
- **Latency**: Image capture aur topic publication ke darmiyan waqt.
- **Dropped frames**: Processing load ki wajah se kabhi kabhi gayab paigamat.

#### Domain randomization techniques

- **Visual randomization**: Texture colors, lighting intensity, aur shadow narmi randomize karein.
- **Physics randomization**: Friction coefficients (plus-minus 20%), mass (plus-minus 10%), joint damping (plus-minus 30%).
- **Sensor randomization**: Noise levels, update rates, aur latency mein tabdeeli karein.
- **Environmental randomization**: Floor friction, obstacle positions, aur lighting direction randomize karein.

### Collision geometry muqabla visual geometry tradeoffs

#### Collision geometry ko saada kyun karein?

- **Performance**: Complex meshes contact detection ko sust kar dete hain.
- **Stability**: Concave meshes interpenetration ka sabab ban sakte hain.
- **Accuracy**: Primitives qabil-e-pechgoi contact points faraham karte hain.

### Duniya banane ki behtareen mashwaraat

#### Layout ke usool

1. **Saadgi se shuru karein**: Saada flat floor se shuru karein.
2. **Haqeeqi paimane istemal karein**: Insaan darwaze 0.8 meter chouray hote hain.
3. **Wazeh hudood bayan karein**: Deewarein camera frustum se aage badhni chahiye.
4. **Idraak ke liye texture**: Mukhtalif satahon ke liye mukhtalif textures istemal karein.

#### Physics world configuration

- **Time step**: 0.001 s (1 kHz) robotics ke liye standard hai.
- **Solver iterations**: ODE ke liye 50-100 iterations.
- **ERP/CFM tuning**: Zyada sakht joints ke liye ERP barhayein.
- **Contact parameters**: Har material pair ke liye friction, bounce adjust karein.

#### Aam duniya ki ashiya

| Shi | Maqsad |
|---|---|
| Mezein | Manipulation tasks |
| Kursiyan | Navigation rukawatein |
| Darwaze | Kamre ke darmiyan aboor |
| Seedhiyan | Khari navigation challenge |
| Tang raaste | Rasta manzil bandi pabandian |

### Baray scenes ke liye performance behtari

#### Detail ki satah (LOD)

Door ki ashiya ke liye visual geometry ki pacheedgi kam karein. Gazebo SDF mein lod element ke zariye LOD ko support karta hai.

#### Parallel simulation

Isaac Sim aur NVIDIA ke GPU physics engines wasee parallelization ko support karte hain.

## Chhota case study: apartment assistant

Ek humanoid assistant ko mez se shelf tak bottle le jani hoti hai.

### Tafseeli test matrix

| Trial | Halat | Mutawwaqee rawayya |
|---|---|---|
| 1 | Saada rasta, maalum she | Navigate, pakren, pahunchayen |
| 2 | Kursi se band tang rasta | Rasta dobara manzil bandi karein |
| 3 | She ko doosri mez par le jaya gaya | Pehchan update karein |
| 4 | Kam roshni ki halat | Kam itminan ke saath pehchan barqarar rakhen |
| 5 | Insaan scene se guzarta hai | Ruken, raasta den |
| 6 | She pahunch se bahar hai | Nakami ki ittila dein |
| 7 | Lesdar floor satah | Raftaar kam karein |

## Sim-to-real transfer techniques

Simulation aur physical duniya ke darmiyan reality gap sim-trained policies ko deploy karne mein bunyadi challenge hai.

### System identification

1. **Mass aur inertia**: Har link ka wazan karein.
2. **Friction coefficients**: Haqeeqi satahon par drag tests.
3. **Joint friction**: Maalum torques lagu karein.
4. **Sensor calibration**: Intrinsic aur extrinsic calibration chalayen.

### Domain adaptation hikmat-e-amaliyan

- **Teacher-student training**: Simulation mein train karein, phir student policy mein distill karein.
- **Sim-to-real fine-tuning**: Simulation mein pre-train, phir haqeeqi data par fine-tune.
- **Residual policy learning**: Sim-trained base policy istemal karein.

## Aam simulation kharabiyan

### 1. Interpenetration aur dhamaka

**Wajah**: Time step barha, contact parameters galat, ya collision geometry concave.

**Fix**: max_step_size ko 0.0005 s tak kam karein, solver iterations barhayein.

### 2. Floating-base instability

**Wajah**: Ghair floor plane, galat gravity direction, ya URDF coordinate frame kharabiyan.

**Fix**: Floor plane load hai, gravity direction negative Z hai, tasdiq karein.

### 3. Joint limit violations

**Wajah**: URDF mein joint limits bayan nahi, ya PID gains bahut jareana.

**Fix**: Tamam joints ke liye limit elements shamil karein, PID tune karein.

### 4. Sensor aliasing

**Wajah**: Simulated sensors bilkul sahi interval par update.

**Fix**: Sensor update rates mein arzi noise shamil karein.

### 5. Gravity aur inertia mismatch

**Wajah**: Inertia ki qeematein galat, ya mass haqeeqi nahi.

**Fix**: CAD software se durust inertia tensors ginen.

### 6. URDF coordinate frame kharabiyan

**Wajah**: Joints ya links mein galat origin qeematein.

**Fix**: URDF ko RViz mein dikhayein, har joint origin ki tasdiq karein.

### 7. Model loading kharabiyan

**Wajah**: Model paths galat, meshes ghair, ya Gazebo model database configure nahi.

**Fix**: Absolute paths istemal karein, GAZEBO_MODEL_PATH set karein.

## Amali lab

<div className="lab-box">
<h3>Lab: digital twin bayan karein</h3>
<p>Ek robot task ke liye test duniya design karein. Robot model, kamre ka layout, sensors, test scenario, pass ke mayar, aur nakami ke mayar shamil karein.</p>
</div>

## Quizzes

### Apni samajh ki jaanch karein

1. URDF kya bayan karta hai?
1. Collision meshes kyun ahem hain?
1. Sensors ki simulation mein test karne ka ek fayda kya hai?
1. Simulation ke nataaj haqeeqi duniya mein kyun nakam ho sakte hain?
1. Gazebo ke char physics engines ke naam batayein.
1. Domain randomization kya hai?
1. Collision geometry visual geometry se saada kyun honi chahiye?
1. Robotics simulation ke liye tajawuz kiya gaya time step kya hai?
1. URDF mein inertial element ka maqsad kya hai?
1. ROS TCP Connector seedhe ROS topic subscription se kaise mukhtalif hai?

### Jawabat ki kunji

1. Robot ke links, joints, geometry, aur physical wazahat.
1. Yeh simulator ko contact ki pehchan karne mein madad karte hain.
1. Yeh idraak aur navigation pipelines ko hardware dastiyab hone se pehle test karne ki ijazat dete hain.
1. Haqeeqat mein noise, friction mein farq, lighting mein tabdeeliyan shamil hain.
1. ODE, Bullet, DART, aur MuJoCo.
1. Ek technique jo training episodes mein simulation parameters mein tabdeeli karti hai.
1. Complex meshes contact detection ko sust karte hain.
1. Standard robotics tasks ke liye 0.001 s (1 kHz).
1. Yeh mass aur 3x3 inertia tensor bayan karta hai.
1. TCP Connector socket ke zariye data stream karta hai.

## Lughat

| Lafz | Wazahat |
|---|---|
| **URDF** | Unified Robot Description Format. Robot ki kinematics aur dynamics bayan karta hai. |
| **SDF** | Simulation Description Format. Gazebo simulation worlds bayan karta hai. |
| **Digital twin** | Physical system ki simulated nomaandagi. |
| **Domain randomization** | Training episodes mein simulation parameters mein tabdeeli. |
| **Sim-to-real gap** | Simulation aur haqeeqi duniya ke darmiyan farq. |
| **ODE** | Open Dynamics Engine. Gazebo ka default physics engine. |
| **DART** | Dynamic Animation and Robotics Toolkit. |
| **MuJoCo** | Multi-Joint dynamics with Contact. |
| **IMU** | Inertial Measurement Unit. |
| **LiDAR** | Light Detection and Ranging. |
| **TF tree** | Transform tree. Coordinate frame relationships. |
| **Convex decomposition** | Concave mesh ko convex tukdon mein todna. |
| **System identification** | Haqeeqi hardware ki khususiyaat parhna. |
| **ROS TCP Connector** | Network bridge jo Unity aur ROS 2 ke darmiyan data stream karta hai. |

## Hifazat aur hardware notes

<div className="safety-box">
<h3>Simulation saboot hai, ijazat nahi</h3>
<p>Guuzri hui simulation sabit nahi karti ke robot mehfoos hai. Physical deployment ko ab bhi mahali hifazat, emergency stops, calibrated sensors, aur mohtaat raftaar ki hudood ki zaroorat hai.</p>
</div>
