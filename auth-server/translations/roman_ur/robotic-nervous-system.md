---
sidebar_position: 1
title: The Robotic Nervous System — ROS 2 Communication Architecture
description: >
  Deep technical reference for ROS 2 nodes, topics, services, actions, launch files,
  parameters, DDS middleware, QoS policies, lifecycle nodes, component composition,
  security (SROS2), and cross-compilation for NVIDIA Jetson platforms. Python rclpy
  examples with publisher/subscriber, service client/server, action client/server,
  launch file authoring, and parameter configuration. Designed for RAG chatbot
  retrieval of specific ROS 2 facts and patterns for humanoid robotics.
keywords:
  [
    ROS 2,
    Robot Operating System,
    rclpy,
    nodes,
    topics,
    services,
    actions,
    DDS,
    Data Distribution Service,
    QoS,
    Quality of Service,
    lifecycle nodes,
    component composition,
    SROS2,
    security,
    launch files,
    parameters,
    Jetson,
    cross-compilation,
    middleware,
    publish subscribe,
    request reply,
    actionlib,
    robot middleware,
  ]
---

import PersonalizationToolbar from '@site/src/components/Personalization/PersonalizationToolbar';

# Robotic Nervous System

<PersonalizationToolbar chapterSlug="ros-2/robotic-nervous-system" />

## Seekhne ke nataij

- ROS 2 ke humanoid robot ke control ki saakht mein communication middleware ki taur par kirdar ki wazahat karein.
- Char bunyadi communication bunyadi — topics, services, actions, aur parameters — mein farq karein aur kisi diye gaye engineering ki zaroorat ke liye sahih muntakhib karein.
- Bayan karein ke Python agents `rclpy` client library ke zariye ROS controllers se kaise judte hain.
- Ek soti hukm se chalne wale humanoid robot ke liye sahih topic, service, action aur parameter ki hudood ke saath ek node graph design karein.
- DDS (Data Distribution Service) ko ROS 2 ke neeche transport layer ke taur par samjhein aur yeh real-time, taqseem shuda communication ko kaise mumkin banata hai.
- Sensor data, control commands, aur telemetry streams ke liye QoS profiles configure karein.
- Production systems mein startup, shutdown, aur kharabi se bahali ko munazzam karne ke liye ROS 2 lifecycle nodes istemal karein.
- Memory overhead ko kam karne aur inter-node communication ki raftaar behtar banane ke liye ROS 2 component composition lagu karein.
- Encrypted aur tasdiq shuda node-to-node communication ke liye SROS2 ke saath ROS 2 security set up karein.
- NVIDIA Jetson embedded platforms ke liye ROS 2 workspaces cross-compile karein.

## Tasawwur ki wazahat

ROS 2 woh middleware layer hai jo robot software ko modular tukdon mein communicate karne deta hai. Ek monolithic program ki bajaye jo har subsystem ko control kare, ROS 2 chhote, azad process naam **nodes** ko farogh deta hai. Har node ka ek wahid, wazeh zimmedari hoti hai: sensor padhna, pose andaza lagana, rasta manzil bandi karna, velocity commands publish karna, ya task lifecycle ka intezam karna.

### ROS 2 humanoid robotics ke liye kyun ahem hai

Humanoid robots maujooda sab se pechideh mechatronic systems mein se hain. Ek humanoid ke paas 30+ degrees of freedom, multiple RGB-D cameras, IMUs, force-torque sensors, LiDAR, microphones, aur actuators ho sakte hain jin sab ka real-time mein taawun hona zaroori hai. ROS 2 woh **communication fabric** faraham karta hai jo is taawun ko amali banata hai:

- **Judai ki design**: Idraak, manzil bandi, aur control nodes ko azadana taur par tayar, janch aur deploy kiya ja sakta hai. Ek nayi vision algorithm purane ko navigation stack ko tabdeel kiye baghair badal sakti hai.
- **Zaban ki interoperability**: C++ motion planner Python high-level task manager aur Rust safety monitor ke saath paigamat badal sakta hai. ROS 2 IDL (Interface Definition Language) paigamat schemas ko aik baar mein bayan karta hai; code generation tools C++, Python, aur degar moaana zabanon ke liye bindings tayar karte hain.
- **DDS transport**: ROS 2 DDS (Data Distribution Service) ke oopar banaya gaya hai, jo asal mein difa aur aerospace ke liye design kiya gaya ek ISO-maayari pub/sub middleware hai. DDS daryaft, qabiliyat-e-itminan, multicast, encryption, aur real-time scheduling faraham karta hai — salahiyatein jo ROS 1 mein nahi thin.
- **Tooling ecosystem**: `ros2` CLI, `colcon` build tool, `rosbag2` recording, `rviz2` visualization, `tf2` coordinate transforms, `nav2` navigation, `MoveIt2` manipulation, aur saikdon ki community packages.

### Node graph ka tasawwur

Har chalne wala ROS 2 system ek jihit graph hai jismein nodes edges (topics, services, actions) se jude hote hain. `rqt_graph` aur `ros2 node list` / `ros2 topic list` jaise tools aap ko run-time par is graph ka jaiza lene dete hain. AI-native robotics ke liye, ROS 2 oonchi satah ki dalil aur robot ke rawe ke darmiyan tarjuman ki tarah kaam karta hai. Ek language model faisla kar sakta hai ke robot ko ek shelf ka jaiza lena chahiye, lekin ROS 2 us niyat ko paigamat, maqsad, feedback, aur controller interfaces mein badal deta hai.

### DDS aur rmiddleware layer

ROS 2 ek pluggable middleware layer mutarif karata hai jise **rmiddleware** kaha jata hai. Default par, ROS 2 **CycloneDDS** (Ubuntu) ya **Fast DDS** (Windows/macOS) istemal karta hai, lekin aap application code tabdeel kiye baghair badal sakte hain. Middleware ka intezam karta hai:

- **Khudkaar daryaft**: Nodes network par markazi broker ke baghair ek dusre ko dhoondte hain.
- **Serialization**: Paigamat CDR (Common Data Representation) ka istemal karte hue serialize kiye jate hain.
- **Transport**: Daryaft ke liye UDP multicast, data ke liye unicast. Ek machine ke andar zero-copy performance ke liye shared memory transport dastyab hai.
- **QoS muzakira**: Publishers aur subscribers connection ke waqt mutabiq quality-of-service profiles ka muzakira karte hain.

## Visual model: ROS 2 communication ki qismein

<div className="visual-panel">
<h3>Kam ki buniyad par communication ki shakl muntakhib karein.</h3>
<div className="textbook-grid">
<div className="textbook-card"><h3>Topic</h3><p>Musalsal dhara. Camera frames, odometry, scan data, aur status updates ke liye istemal karein. Fire-and-forget, many-to-many, judai paida karne wala / masraf kanda.</p></div>
<div className="textbook-card"><h3>Service</h3><p>Darkhwast aur jawab. Reset, configuration, haalat haal karne, ya calibration trigger karne jaisi fori queries ke liye istemal karein. Mutabiq, one-to-one, jawab aane tak ruk jata hai.</p></div>
<div className="textbook-card"><h3>Action</h3><p>Feedback ke saath tawil arsay chalne wala maqsad. Navigation, manipulation, docking, ya inspection tasks ke liye istemal karein. Ghair-mutabiq, rad karm ki himayat, darmyani peshraft updates faraham karta hai.</p></div>
<div className="textbook-card"><h3>Parameter</h3><p>Run-time configuration. Speed limits, topic names, thresholds, aur modes ke liye istemal karein. Node startup par bayan karein, `ros2 param set` ya parameter service ke zariye run-time par tabdeel karein.</p></div>
</div>
</div>

## Misal node graph: soti hukm se navigation tak

<div className="visual-panel">
<div className="visual-flow">
<div className="flow-step"><span>Audio node</span>Microphone input → khame PCM</div>
<div className="flow-step"><span>Speech node</span>PCM → text command via ASR</div>
<div className="flow-step"><span>Intent node</span>Text → sakht bana hua maqsad JSON</div>
<div className="flow-step"><span>Tasdiq node</span>Maqsad → pabandi check</div>
<div className="flow-step"><span>Navigation action</span>NavigateToPose maqsad → feedback → natija</div>
<div className="flow-step"><span>Monitor node</span>Feedback, bahali, timeout handling</div>
</div>
</div>

## Kab kaun si bunyadi cheez istemal karein

| Zaroorat | Behtarin ROS 2 bunyadi cheez | Misal | Kyun |
|---|---|---|---|
| Robot ki pose fi second multipul baar publish karein | Topic | `/odom` | Oonchi frequency, lossy-ok, judai paida karna |
| Poochein ke naqsha load hua ya nahi | Service | `/map_server/load_map` | Fori query, jawab zaroori, one-shot |
| Robot ko ek kamre mein bhejein aur peshraft track karein | Action | `/navigate_to_pose` | Tawil arsay chalne wala, feedback zaroori, rad karm ke qabil |
| Lab ki zyada se zyada raftaar tabdeel karein | Parameter | `max_linear_velocity` | Run-time tuning, code tabdeeli ki zaroorat nahi |
| 30 Hz par camera frames stream karein | Topic | `/camera/color/image_raw` | Oonchi bandwidth, subscribers ki tadaad mukhtalif |
| Sensor calibration trigger karein | Service | `/imu/calibrate` | Blocking operation, kamyabi ki tasdiq zaroori |
| Pick-and-place sequence anjam dein | Action | `/manipulator/pick_place` | Multipul marhalay, darmyani feedback zaroori |
| Run-time par debug logging toggle karein | Parameter | `debug_enabled` | Fori asar, dobara start ki zaroorat nahi |

## Tafseeli code misalein (Python rclpy)

### Publisher node

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class TalkerNode(Node):
    """Publishes a string message on the 'chatter' topic at 10 Hz."""

    def __init__(self):
        super().__init__('talker')
        self.declare_parameter('publish_rate', 10.0)
        rate = self.get_parameter('publish_rate').value

        self.publisher_ = self.create_publisher(String, 'chatter', 10)
        self.timer = self.create_timer(1.0 / rate, self.timer_callback)
        self.count = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello ROS 2 — count: {self.count}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.count += 1


def main(args=None):
    rclpy.init(args=args)
    node = TalkerNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Subscriber node

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class ListenerNode(Node):
    """Subscribes to 'chatter' and logs received messages."""

    def __init__(self):
        super().__init__('listener')
        self.subscription = self.create_subscription(
            String,
            'chatter',
            self.listener_callback,
            10  # QoS history depth
        )

    def listener_callback(self, msg: String):
        self.get_logger().info(f'I heard: "{msg.data}"')


def main(args=None):
    rclpy.init(args=args)
    node = ListenerNode()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Custom message definition (IDL)

`msg/HumanoidCommand.msg` file banayein:

```
# HumanoidCommand.msg
string command_id
string target_room
string task_type          # "navigate" | "inspect" | "manipulate"
float64 confidence        # 0.0 - 1.0
float64 timeout_sec
bool allow_recovery
geometry_msgs/Pose target_pose
```

Python aur C++ bindings banane ke liye `colcon build --packages-select my_interfaces` chalayein.

### Service server

```python
import rclpy
from rclpy.node import Node
from my_interfaces.srv import GetRobotState


class StateServer(Node):
    """Responds to GetRobotState requests with current robot state."""

    def __init__(self):
        super().__init__('state_server')
        self.srv = self.create_service(
            GetRobotState,
            'get_robot_state',
            self.handle_get_state
        )
        self.get_logger().info('State server ready.')

    def handle_get_state(self, request, response):
        self.get_logger().info(f'Request for robot_id={request.robot_id}')
        response.state = 'idle'
        response.battery_pct = 87.3
        response.current_task = 'none'
        response.is_safe = True
        return response


def main(args=None):
    rclpy.init(args=args)
    node = StateServer()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Service client

```python
import rclpy
from rclpy.node import Node
from my_interfaces.srv import GetRobotState


class StateClient(Node):
    """Sends a GetRobotState request and logs the response."""

    def __init__(self):
        super().__init__('state_client')
        self.client = self.create_client(GetRobotState, 'get_robot_state')
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Waiting for state service...')
        self.req = GetRobotState.Request()

    def send_request(self, robot_id: str):
        self.req.robot_id = robot_id
        future = self.client.call_async(self.req)
        future.add_done_callback(self.response_callback)

    def response_callback(self, future):
        try:
            result = future.result()
            self.get_logger().info(
                f'State: {result.state}, Battery: {result.battery_pct}%, '
                f'Safe: {result.is_safe}'
            )
        except Exception as e:
            self.get_logger().error(f'Service call failed: {e}')


def main(args=None):
    rclpy.init(args=args)
    node = StateClient()
    node.send_request('humanoid_01')
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Action server (rclpy.action istemal karte hue)

```python
import time
import rclpy
from rclpy.node import Node
from rclpy.action import Server
from my_interfaces.action import NavigateToPose


class NavActionServer(Node):
    """Action server that simulates navigation with periodic feedback."""

    def __init__(self):
        super().__init__('nav_action_server')
        self._action_server = Server(
            self,
            NavigateToPose,
            'navigate_to_pose',
            execute_callback=self.execute_callback,
            feedback_callback=self.feedback_callback,
            goal_callback=self.goal_callback,
            cancel_callback=self.cancel_callback,
        )
        self.get_logger().info('Nav action server ready.')

    def goal_callback(self, goal_handle):
        self.get_logger().info(
            f'Received goal: room={goal_handle.request.target_room}'
        )
        return  # accept all goals (return rclpy.action.GOAL_ACCEPT)

    def cancel_callback(self, goal_handle):
        self.get_logger().info('Cancel requested.')
        return rclpy.action.CancelResponse.ACCEPT

    def feedback_callback(self, goal_handle, feedback):
        self.get_logger().info(
            f'Feedback: distance_remaining={feedback.feedback.distance_remaining:.2f}m'
        )

    def execute_callback(self, goal_handle):
        self.get_logger().info('Executing navigation goal...')
        target_room = goal_handle.request.target_room
        total_distance = 10.0  # simulated meters
        feedback_msg = NavigateToPose.Feedback()

        for step in range(1, 11):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled.')
                return NavigateToPose.Result(success=False, message='Canceled')

            time.sleep(0.5)
            remaining = total_distance - (step * total_distance / 10)
            feedback_msg.distance_remaining = remaining
            goal_handle.publish_feedback(feedback_msg)
            self.get_logger().info(f'Step {step}/10 — {remaining:.1f}m remaining')

        goal_handle.succeed()
        result = NavigateToPose.Result()
        result.success = True
        result.message = f'Arrived at {target_room}'
        self.get_logger().info(result.message)
        return result


def main(args=None):
    rclpy.init(args=args)
    node = NavActionServer()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Action client

```python
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from my_interfaces.action import NavigateToPose


class NavActionClient(Node):
    """Sends a navigation goal and monitors feedback and result."""

    def __init__(self):
        super().__init__('nav_action_client')
        self._action_client = ActionClient(
            self,
            NavigateToPose,
            'navigate_to_pose'
        )

    def send_goal(self, target_room: str):
        self._action_client.wait_for_server()
        goal = NavigateToPose.Goal()
        goal.target_room = target_room
        goal.task_type = 'navigate'
        goal.timeout_sec = 60.0

        self.get_logger().info(f'Sending goal: {target_room}')
        future = self._action_client.send_goal_async(
            goal,
            feedback_callback=self.feedback_callback
        )
        future.add_done_callback(self.goal_response_callback)

    def feedback_callback(self, feedback_msg):
        fb = feedback_msg.feedback
        self.get_logger().info(
            f'Feedback: {fb.distance_remaining:.1f}m remaining'
        )

    def goal_response_callback(self, future):
        goal_handle = future.result()
        if goal_handle.accepted:
            self.get_logger().info('Goal accepted.')
            result_future = goal_handle.get_result_async()
            result_future.add_done_callback(self.result_callback)
        else:
            self.get_logger().warn('Goal rejected.')

    def result_callback(self, future):
        result = future.result().result
        self.get_logger().info(
            f'Result: success={result.success}, message="{result.message}"'
        )


def main(args=None):
    rclpy.init(args=args)
    node = NavActionClient()
    node.send_goal('kitchen')
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Launch file (Python)

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch.conditions import IfCondition


def generate_launch_description():
    # Declare parameters
    use_sim_time_arg = DeclareLaunchArgument(
        'use_sim_time',
        default_value='false',
        description='Use simulation clock'
    )
    namespace_arg = DeclareLaunchArgument(
        'namespace',
        default_value='',
        description='Node namespace'
    )
    debug_arg = DeclareLaunchArgument(
        'debug',
        default_value='false',
        description='Enable debug logging'
    )

    # Nodes
    talker_node = Node(
        package='demo_nodes_cpp',
        executable='talker',
        name='talker',
        namespace=LaunchConfiguration('namespace'),
        parameters=[{
            'use_sim_time': LaunchConfiguration('use_sim_time'),
            'publish_rate': 20.0,
        }],
        remappings=[
            ('chatter', '/robot/status'),
        ],
        output='screen',
    )

    listener_node = Node(
        package='demo_nodes_cpp',
        executable='listener',
        name='listener',
        namespace=LaunchConfiguration('namespace'),
        parameters=[{
            'use_sim_time': LaunchConfiguration('use_sim_time'),
        }],
        remappings=[
            ('chatter', '/robot/status'),
        ],
        output='screen',
    )

    debug_logger = Node(
        package='rqt_console',
        executable='rqt_console',
        name='debug_console',
        condition=IfCondition(LaunchConfiguration('debug')),
        output='screen',
    )

    return LaunchDescription([
        use_sim_time_arg,
        namespace_arg,
        debug_arg,
        talker_node,
        listener_node,
        debug_logger,
    ])
```

### Parameter configuration (YAML file)

`config/robot_params.yaml` ke taur par mehfooz karein:

```yaml
/**:
  ros__parameters:
    use_sim_time: false
    robot:
      max_linear_velocity: 0.5
      max_angular_velocity: 1.0
      emergency_stop_distance: 0.3
      battery_warning_pct: 20.0
    perception:
      camera_topic: '/camera/color/image_raw'
      confidence_threshold: 0.75
      enable_depth: true
    navigation:
      planner_plugin: 'NavfnPlanner'
      controller_plugin: 'DWBController'
      recovery_behavior_enabled: true
```

Load karein: `ros2 run my_robot_controller node --ros-args --params-file config/robot_params.yaml`

Ya code mein parameters bayan karein:

```python
self.declare_parameter('robot.max_linear_velocity', 0.5)
self.declare_parameter('robot.emergency_stop_distance', 0.3)
self.declare_parameter('perception.confidence_threshold', 0.75)
```

### Gahraai se wazahat wale zir-unwan

### Node zimmedari design

Ek ROS 2 node ka ek wazeh kaam hona chahiye. Ek single node banane se bachein jo speech sune, rasta manzil bandi kare, camera frames padhe, aur movement commands bheje. Is tarah ka monolithic node jaanch karna mushkil, tabdeel karna ghair mehfoos, aur azadana taur par dobara shuru karna namumkin hai.

| Node | Zimmedari | Misal ka data | Communication |
|---|---|---|---|
| Speech node | Audio ko text mein tabdeel karta hai | `"go to the kitchen"` | Topic (khame audio), Service (ASR configuration) |
| Intent node | Text ko sakht bana huwa maqsad mein tabdeel karta hai | `{room: "kitchen", task: "navigate"}` | Topic (text in), Topic (maqsad out) |
| Idraak node | Object ya manzar ki haalat publish karta hai | object labels, confidence, poses | Topic (detections), Service (capture) |
| Navigation node | Rasta maqsad anjam deta hai | action feedback aur natija | Action (NavigateToPose) |
| Safety node | Pabandiyan validate karta hai, e-stop trigger karta hai | roko, sust karein, dobara manzil bandi karein | Topic (cmd_vel in), Topic (cmd_vel out) |

### Paigamat design ke usool

Achhe robot paigamat wazeh hote hain. `"clean room"` jaisa dhundla paigamat ek language model ke liye asan hai lekin robot interface ke liye kharab hai. Validate kiye ja sakte hue sakht bana huay fields ko tarjeeh dein:

```good
# Good: wazeh, typed, validated
string command_id
string target_room
string task_type        # enumerated values
float64 confidence      # bounded 0.0-1.0
float64 timeout_sec     # must be > 0
bool allow_recovery
```

```bad
# Bad: dhundla, ghair-validate
string command
```

Data ke liye `.msg` files aur request/reply ke liye `.srv` files istemal karein. Feedback aur result qismon ke saath tawil arsay chalne wale maqsad ke liye `.action` files istemal karein.

### Quality of Service (QoS) ki gahraai

ROS 2 QoS policies publishers aur subscribers ke darmiyan delivery semantics ko control karti hain. Yeh real-time robot systems ke liye ahem hain.

**Qabiliyat-e-itminan**:
- `RELIABLE`: Delivery ki zamanat deta hai. Gum shuda paigamat dobara bhejta hai. Control commands, parameter updates, action maqsad ke liye istemal karein. Zyada latency.
- `BEST_EFFORT**: Koi dobara bhejna nahi. Kam latency. Sensor streams (LiDAR, camera, IMU) ke liye istemal karein jahan taza data mukammal hone se zyada ahem hai.

**Thahrao**:
- `TRANSIENT_LOCAL`: Der se shamil hone wale subscribers ko aakhri N paigamat milte hain (tareekh ki ghatta tak). Configuration topics, status broadcasts ke liye istemal karein.
- `VOLATILE**: Der se shamil hone walon ko kuch nahi milta. Oonchi frequency sensor data ke liye istemal karein jahan purana data nuksandeh hai.

**Tareekh ki ghatta**:
- `KEEP_LAST`: Sirf N tareen paigamat rakhein (qabil tarteeb ghatta). Ghair-mahdood qatar ki tausee ko rokta hai.
- `KEEP_ALL**: Tamam paigamat rakhein. Agar subscribers sust hain to memory masail paida kar sakta hai.

**Deadline**:
- Paigamat ke darmiyan mutawaqqa zyada se zyada waqfa. Agar publisher deadline chhor de, to subscribers ko event callback ke zariye agahi ki jati hai. Safety-critical monitoring ke liye istemal karein.

**Zinda**:
- Khudkar ya dasti dawa ke node zinda hai. Agar zinda lease khatam ho jaye, to subscribers ko agahi ki jati hai. Toote hue nodes ki nishandahi ke liye istemal karein.

**Misal QoS profiles**:

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy, HistoryPolicy

# Sensor data QoS (camera, LiDAR)
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    durability=DurabilityPolicy.VOLATILE,
    history=HistoryPolicy.KEEP_LAST,
    depth=5,
)

# Control command QoS
control_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    history=HistoryPolicy.KEEP_LAST,
    depth=10,
)

# Status broadcast QoS
status_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    history=HistoryPolicy.KEEP_LAST,
    depth=1,
)
```

**QoS mutabiqat**: Publishers aur subscribers ki QoS policies mutabiq honi chahiye. Ghair-mutabiq jore khamoshi se munqati ho jate hain. QoS ka jaiza lene aur connection ke masail ki tashkhees ke liye `ros2 topic info -v <topic>` istemal karein.

### ROS 2 lifecycle nodes

Lifecycle nodes ek khaas node qism hai (`lifecycle_node`) jo munazzam nodes ke liye ek mayari riyazi machine nafiz karte hain. Yeh production robotics ke liye zaroori hai jahan aap ko yaqini startup, shutdown, aur kharabi se bahali zaroori hai.

**Haaltein**:
1. **Ghair-configure** — Node banaya gaya hai lekin abhi tak configure nahi hua.
2. **Ghair-faal** — Node configure hai lekin data par karwai nahi kar raha.
3. **Faal** — Node mukammal taur par karkardah hai.
4. **Finalize** — Node band ho raha hai.
5. **Kharabi** — Node ko kharabi aayi. Bahali ki koshish kar sakta hai.

**Intqaliya**: `configure`, `activate`, `deactivate`, `cleanup`, `shutdown`, `recover`.

**Misal lifecycle node**:

```python
import rclpy
from rclpy.lifecycle import LifecycleNode, TransitionCallbackReturn
from std_msgs.msg import String


class ManagedSensorNode(LifecycleNode):
    """Lifecycle-managed sensor node with state transitions."""

    def __init__(self):
        super().__init__('managed_sensor')
        self.publisher_ = None

    def on_configure(self, state):
        self.get_logger().info(f'Configuring from state {state.label}')
        self.publisher_ = self.create_lifecycle_publisher(String, 'sensor_data', 10)
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state):
        self.get_logger().info(f'Activating from state {state.label}')
        # Start sensor hardware, timers, subscriptions here
        self.timer = self.create_timer(0.1, self.publish_data)
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state):
        self.get_logger().info(f'Deactivating from state {state.label}')
        self.timer.cancel()
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state):
        self.get_logger().info(f'Cleaning up from state {state.label}')
        self.publisher_.destroy()
        self.publisher_ = None
        return TransitionCallbackReturn.SUCCESS

    def on_shutdown(self, state):
        self.get_logger().info(f'Shutting down from state {state.label}')
        return TransitionCallbackReturn.SUCCESS

    def on_error(self, state):
        self.get_logger().error(f'Error in state {state.label}')
        return TransitionCallbackReturn.SUCCESS  # attempt recovery

    def publish_data(self):
        msg = String()
        msg.data = 'sensor reading'
        self.publisher_.publish(msg)
```

**Lifecycle manager** (`nav2` / `lifecycle` package se): Khudkar taur par multipul lifecycle nodes mein tarteebwar intqaliya trigger karta hai. Peche startup sequences ko tarteeb dene ke liye zaroori.

### Component composition

ROS 2 components aap ko ek hi process mein multipul nodes chalne dete hain. Yeh tightly-coupled nodes ke liye IPC overhead ko khatam karta hai, memory istemal ko kam karta hai, aur zero-copy intra-process communication ko mumkin banata hai.

**Component node banana**:

```python
from rclpy.executors import ComponentIsolatedExecutor
```

`component` package aur `component_ros2` tool aap ko ijazat dete hain:

1. Node ko ek shared library (component) ke taur par banayein.
2. Components ko container process mein load karein.
3. Ek process mein multipul components ko jodein.

**Component container launch karna**:

```bash
ros2 run rclcpp_components component_container --ros-args -r __node:=my_container
ros2 component load /my_container my_package my_component::MyNode
ros2 component list  # list loaded components
```

**Intra-process communication**: Jab nodes ek hi container mein hon, to aap zero-copy message passing ke liye intra-process communication faal kar sakte hain. Yeh oonchi bandwidth data jaise point clouds ya video streams ke liye ahem hai jo idraak nodes ke darmiyan hota hai.

### ROS 2 security (SROS2)

ROS 2 Security node communication ke liye encryption, tasdiq, aur access control faraham karta hai. Yeh DDS-Security istemal karta hai, jo DDS ka ek mayari extension hai.

**Ahem khasusiyaat**:
- **TLS encryption**: Tamam DDS traffic transit mein encrypt hota hai.
- **Tasdiq**: Nodes ko graph mein shamil hone ke liye durust certificates pesh karne hote hain.
- **Access control**: Bareek access policies control karti hain ke kaun se nodes kin topics par publish/subscribe kar sakte hain.

**SROS2 set up karna**:

```bash
# Generate a keystore
ros2 security create_keystore ~/sros2_keystore

# Create permissions for a node
ros2 security create_enclave ~/sros2_keystore /my_robot/controller

# Launch with security enabled
ROS_SECURITY_KEYSTORE=~/sros2_keystore \
ROS_SECURITY_ENCLAVE=/my_robot/controller \
ros2 launch my_robot secure_launch.py
```

**SROS2 kab istemal karein**: Ghair-moataqad networks mein chalne wale production humanoid robots, multipul-robot systems jahan paigamat ki salamat ahem hai, cloud-se jude robots jahan telemetry haisiyat hai.

### Jetson ke liye cross-compilation

NVIDIA Jetson (Orin, Xavier, Nano) platforms humanoid robots ke liye sab se common embedded hedef hain. Cross-compilation aap ko x86 host par ROS 2 packages banane aur ARM64 hedef par deploy karne deta hai.

**ros_cross_compile istemal karna**:

```bash
# Install the cross-compilation tool
pip install ros-cross-compile

# Cross-compile for Jetson Orin (aarch64)
ros_cross_compile \
  --arch aarch64 \
  --os noble \
  --ros distro humble \
  --install-space /opt/ros/humble \
  --workspace ~/robot_ws
```

**Docker-mabni tareeqa**:

```bash
# Use NVIDIA's l4t container
docker run -it --runtime=nvidia \
  -v ~/robot_ws:/robot_ws \
  nvcr.io/nvidia/l4t-tensorrt:r8.5.2-runtime \
  bash

# Build inside the container
cd /robot_ws && colcon build --cmake-args -DCMAKE_BUILD_TYPE=Release
```

**Ahem ghor-o-fikr**:
- Behtarin binaries ke liye `-DCMAKE_BUILD_TYPE=Release` istemal karein.
- Headless Jetson builds ke liye GUI dependencies wale packages (rviz2, rqt) ghair-faal karein.
- Sirf zaroori packages banane ke liye `--packages-select` istemal karein.
- Deploy ke baad hedef par `ros2 launch` se jaanch karein.

## Amali lab

<div className="lab-box">
<h3>Lab: ROS graph design karein</h3>
<p>Is hukm ke liye ek node graph banayein: "Go to the kitchen and find the red cup." Is mein shamil karein:</p>
<ul>
<li>Kam az kam teen topics (audio, idraak, haalat).</li>
<li>Kam az kam ek service (robot haalat query ya calibration).</li>
<li>Kam az kam ek action (NavigateToPose ya ManipulateObject).</li>
<li>Ek tasdiq node jo movement se pehle confidence check karta hai.</li>
<li>Ek safety node jo rukawaton ki nishandahi hone par cmd_vel ko override kar sakta hai.</li>
<li>Kam az kam do QoS profiles (sensor best-effort, control reliable).</li>
</ul>
</div>

## Aam ROS 2 masail ki tashkhees

### Nodes ek dusre ko dhoond nahi sakte

**Alamat**: `ros2 topic list` topics dikhata hai lekin `ros2 topic echo` kuch nahi multa.

**Wajuhal aur hal**:
- **Network configuration**: DDS daryaft ke liye multicast istemal karta hai. Yaqini karein ke `localhost` ya sahih network interface muntakhib hai. `RMW_IMPLEMENTATION=rmw_cyclonedds_cpp` set karein aur CycloneDDS XML configure karein:
  ```xml
  <CycloneDDS>
    <Domain>
      <General>
        <Interfaces>
          <NetworkInterface name="eth0"/>
        </Interfaces>
      </General>
    </Domain>
  </CycloneDDS>
  ```
- **QoS ghair-mutabiqat**: QoS check karne ke liye `ros2 topic info -v <topic>` istemal karein. Yaqini karein ke publishers aur subscribers ki profiles mutabiq hain.
- **Firewall**: DDS communication ke liye UDP ports 7400-7500 khule hone chahiye.

### Paigamat giraye jate hain ya multa nahi

**Alamat**: `ros2 topic hz` mutawaqqa frequency dikhata hai lekin subscriber kam paigamat multa hai.

**Hal**: QoS qabiliyat-e-itminan check karein. Agar publisher `BEST_EFFORT` istemal karta hai lekin subscriber `RELIABLE` mutawaqqa karta hai, to woh mutassil nahi honge. Profiles mel khayein ya tashkhees ke liye `ros2 topic info -v` istemal karein.

### Action servers maqsad multa nahi

**Alamat**: Action client ek maqsad bhejta hai lekin kabhi jawab nahi milta.

**Hal**: Yaqini karein ke action server chal raha hai aur action interface names bilkul mutabiq hain. Tasdiq ke liye `ros2 action list` istemal karein. Check karein ke action server ka `goal_callback` ek accept response lautata hai.

### Parameter tabdeeliyan asar nahi kar rahi

**Alamat**: `ros2 param set` kamyabi lautata hai lekin rawe nahi badalta.

**Hal**: Tasdiq karein ke node parameter bayan karta hai aur usay sahih waqt par padhta hai. Kuch parameters sirf ibtida mein padhe jate hain (masalan timer muddat). Mojuda qeematein dekhne ke liye `ros2 param dump <node>` istemal karein.

### Launch file kharabiyan

**Alamat**: `ros2 launch` dakhla kharabiyan ya ghair-maujood executable ki wajah se nakaam hota hai.

**Hal**: Yaqini karein ke package banaya gaya hai (`colcon build`) aur source kiya gaya hai (`source install/setup.bash`). Executive names ki tasdiq ke liye `ros2 pkg executables <package_name>` istemal karein.

## Production ROS 2 ke liye behtareen mashware

1. **Lifecycle nodes istemal karein** har us node ke liye jo hardware ya haalat ka intezam karta hai. Yeh aap ko yaqini startup aur shutdown sequences deta hai.
2. **Hamesha parameters bayan karein** defaults ke saath. Kabhi bayan kiye baghar parameters ki maujoodgi qubool na karein.
3. **QoS profiles jaan bujh kar istemal karein**. Sensor data → `BEST_EFFORT` + `VOLATILE`. Control commands → `RELIABLE` + `TRANSIENT_LOCAL`.
4. **Tamam aane wale paigamat validate karein**. Dusron se data par baghair types, ranges, aur timestamps check ke bharosa na karein.
5. **Subsystem ko alag karne ke liye namespaces istemal karein**. `/robot/perception/camera` `/camera` se behtar hai.
6. **Debugging aur regression testing ke liye `rosbag2` se record karein**. Ghair-mutabiq QoS ke liye `--qos-profile-overwrite` istemal karein.
7. **Aam build configurations ke liye `colcon mixin` istemal karein**: `colcon build --mixin release`.
8. **Aam configuration masail check karne ke liye `ros2 doctor` se monitor karein**.
9. **Coordinate transforms ke liye `tf2` istemal karein**. Frame ke taluqat ko kabhi hardcode na karein.
10. **Production mein SROS2 faal karein**. Ghair-moataqad devices wale network par ghair-encrypt DDS kabhi na chalayein.
11. **Code mein topic names hardcode karne ki bajaye remapping ke liye `--ros-args` istemal karein**.
12. **Integration se pehle har node ki azadana taur par jaanch karein** `launch_testing` aur `pytest` ke saath node test likhein.
13. **Hasb-e-zaroorat filtering ki bajaye sensor fusion ke liye `robot_localization` istemal karein**.
14. **Hardware par deploy karne se pehle `ros2 topic delay` aur `ros2 topic hz` se performance profile banayein**.
15. **System ki taraqqi ke saath `rqt_graph` screenshots ke saath apne node graph ki dastawizat banayein aur unhein update rakhein**.

## Quiz

### Apni samajh janchen

1. Kaun si ROS 2 bunyadi cheez camera frames ke liye behtarin hai?
1. Kaun si bunyadi cheez tawil arsay chalne wale navigation maqsad ke liye behtarin hai?
1. AI planner ko seedha motor commands ki bajaye sakht bana huay maqsad kyun banane chahiye?
1. Rclpy Python code ko kya karne deta hai?
1. DDS kya hai aur ROS 2 usay kyun istemal karta hai?
1. `RELIABLE` aur `BEST_EFFORT` QoS mein kya farq hai?
1. Aap aam node ki bajaye lifecycle node kab istemal karein ge?
1. Component composition kaun sa masal hal karta hai?
1. Aap ROS 2 mein encryption kaise faal karte hain?
1. Control command topic ke liye sahih QoS profile kya hai?
1. Aap production code mein topic names hamesha kyun hardcode nahi kar sakte?
1. Aap ek topic par QoS mutabiqat ka jaiza lene ke liye kaun sa tool istemal karte hain?

### Jawabat

1. Ek topic — oonchi frequency, judai paida karne wala, lossy-ok sensor stream.
1. Ek action — tawil arsay chalne wala, feedback zaroori, rad karm ki himayat.
1. Sakht bana huay maqsad ko validate, mehdood, monitor, aur controllers ke zariye mehfoos tareeqe se tarjuma kiya ja sakta hai. Yeh type checking aur run-time parameter tuning ko bhi mumkin banate hain.
1. Yeh Python programs ko `rclpy` client library ka istemal karte hue ROS 2 nodes, publishers, subscribers, services, actions, aur parameters banane deta hai.
1. DDS (Data Distribution Service) ek ISO-maayari pub/sub middleware hai jo daryaft, qabiliyat-e-itminan, multicast, encryption, aur real-time scheduling faraham karta hai. ROS 2 usay transport layer ke taur par istemal karta hai taake application code network details se juda ho.
1. `RELIABLE` dobara bhej kar delivery ki zamanat deta hai (zyada latency). `BEST_EFFORT` gum shuda packets girata hai (kam latency). Commands ke liye reliable, sensors ke liye best-effort istemal karein.
1. Lifecycle nodes tab istemal karein jab aap ko yaqini startup/shutdown sequences, munazzam intqaliya, ya kharabi se bahali zaroori ho — khaas taur par hardware interfaces ya production systems ke liye.
1. Component composition ek hi process mein multipul nodes chala kar IPC overhead ko khatam karta hai, zero-copy intra-process communication ko mumkin banata hai, aur memory istemal ko kam karta hai.
1. SROS2 (ROS 2 Security) istemal karein jo DDS-Security ke zariye TLS encryption, node tasdiq, aur access control policies faraham karta hai.
1. `RELIABLE` + `TRANSIENT_LOCAL` thahrao, 10-20 paigamat ki tareekh ki ghatta ke saath.
1. Hardcoding nodes ko ghair-lachakdar banata hai aur topic names badalne par tod deta hai. Remapping ke liye `--ros-args -r` aur configuration ke liye `--params-file` istemal karein.
1. `ros2 topic info -v <topic>` us topic par tamam publishers aur subscribers ki QoS profiles dikhata hai aur ghair-mutabiqaton ko namaya karta hai.

## Safety aur hardware notes

<div className="safety-box">
<h3>Control ki had</h3>
<p>AI layer ek maqsad tajweez kar sakta hai. ROS 2 controllers faisla karte hain ke woh maqsad kaise movement ban jata hai. Speed limits, takrao ki jaanch, aur emergency-stop rawe ko language model ke bahar rakhein. Safety node ek alag, azadana taur par jaanch ke qabil ROS 2 node hona chahiye jo kisi bhi waqt cmd_vel ko override kar sake.</p>
</div>

## Lughat

| Istalah | Tareef |
|---|---|
| **ROS 2** | Robot Operating System 2 — robot software ki taraqqi ke liye ek muft middleware framework, DDS par mabni. |
| **Node** | Ek process jo ROS 2 system mein ek wahid, wazeh function anjam deta hai. |
| **Topic** | Publish/subscribe messaging ke liye ek naamdar, typed communication channel. |
| **Service** | Do nodes ke darmiyan ek mutabiq request/reply communication mechanism. |
| **Action** | Maqsad, feedback, aur result marhalon ke saath ek ghair-mutabiq, tawil arsay chalne wala task. |
| **Parameter** | Ek qabil tarteeb qeemat jo code tabdeeli ke baghair run-time par set ki ja sakti hai. |
| **Launch file** | Ek script jo makhsoos configurations ke saath multipul nodes shuru karta hai. |
| **rclpy** | Python ke liye ROS 2 Client Library — ROS 2 ka Python API. |
| **DDS** | Data Distribution Service — ISO-maayari pub/sub middleware jo ROS 2 transport ke liye istemal karta hai. |
| **QoS** | Quality of Service — qabiliyat-e-itminan, thahrao, tareekh, deadline, aur zinda ko control karne wali policies. |
| **Lifecycle node** | Startup, shutdown, aur kharabi se bahali ke liye mayari riyazi machine wala ek munazzam node. |
| **Component** | Ek load ki ja sakti node library jo zero-copy IPC ke liye container process mein jodi ja sakti hai. |
| **SROS2** | ROS 2 Security — DDS communication ke liye encryption, tasdiq, aur access control. |
| **colcon** | Packages banane, jaanchne, aur install karne ka ROS 2 build tool. |
| **rosbag2** | Debugging aur testing ke liye ROS 2 paigamat data record aur replay karne ka tool. |
| **tf2** | Robot links aur sensors ke darmiyan coordinate frame transforms ke intezam ke liye ek library. |
| **IDL** | Interface Definition Language — ROS 2 paigamat, services, aur actions ke liye schema format. |
| **CDR** | Common Data Representation — paigamat encoding ke liye DDS istemal karne wala serialization format. |
| **rmiddleware** | ROS 2 mein pluggable middleware abstraction layer jo DDS ki tabdeeli ki ijazat deta hai. |
| **CycloneDDS** | Ek muft DDS takmeel jo aam taur par ROS 2 mein default RMW ke taur par istemal hota hai. |
| **Fast DDS** | eProsima se ek muft DDS takmeel, kuch platforms par default RMW ke taur par istemal hoti hai. |
| **Remapping** | ROS 2 ka mechanism jo launch time par code tabdeeli ke baghair topics, services, aur parameters ka naam badalne deta hai. |
| **Namespace** | Ek mani grouping prefix jo subsystem ki alagai ke liye node names aur topic names par lagu hota hai. |
| **cmd_vel** | Robot controllers ko bheji gayi velocity commands (`geometry_msgs/msg/Twist`) ka standard topic name. |
| **Odom** | Odometry data — chakki ke encoders ya visual odometry se robot pose andaza ka standard topic name. |
| **IMU** | Inertial Measurement Unit — tezi aur zaviya velocity data faraham karne wala sensor. |
| **LiDAR** | Light Detection and Ranging — naqshabandi aur rukawat ki nishandahi ke liye laser-mabni range sensor. |
| **Jetson** | NVIDIA Jetson family — aam taur par mobile robot processing ke liye istemal hone wale embedded ARM64 computing platforms. |
| **Cross-compilation** | Ek platform (x86) par software banana mukhtalif platform (ARM64 Jetson) par execution ke liye. |
