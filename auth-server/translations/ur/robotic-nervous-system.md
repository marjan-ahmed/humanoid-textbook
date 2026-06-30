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

# روبوٹک عصبی نظام

<PersonalizationToolbar chapterSlug="ros-2/robotic-nervous-system" />

## سیکھنے کے نتائج

- ROS 2 کے انسان نما روبوٹ کے کنٹرول کی ساخت میں کمیونیکیشن مڈل ویئر کی طور پر کردار کی وضاحت کریں۔
- چار بنیادی کمیونیکیشن بنیادیں — ٹاپکس، سروسز، ایکشنز، اور پیرامیٹرز — میں فرق کریں اور کسی دیے گئے انجینئرنگ کی ضرورت کے لیے صحیح منتخب کریں۔
- بیان کریں کہ Python ایجنت `rclpy` کلائنٹ لائبریری کے ذریعے ROS کنٹرولرز سے کیسے جڑتے ہیں۔
- ایک صوتی حکم سے چلنے والے انسان نما روبوٹ کے لیے صحیح ٹاپک، سروس، ایکشن اور پیرامیٹر کی حدود کے ساتھ ایک نوڈ گراف ڈیزائن کریں۔
- DDS (Data Distribution Service) کو ROS 2 کے نیچے ٹرانسپورٹ لیئر کے طور پر سمجھیں اور یہ ریئل ٹائم، تقسیم شدہ کمیونیکیشن کو کیسے ممکن بناتا ہے۔
- سینسر ڈیٹا، کنٹرول کمانڈز، اور ٹیلی میٹری اسٹریمز کے لیے QoS پروفائیلز کنفیگر کریں۔
- پروڈکشن سسٹمز میں سٹارٹ اپ، شٹ ڈاؤن، اور خرابی سے بحالی کو منظم کرنے کے لیے ROS 2 لائف سائیکل نوڈز استعمال کریں۔
- میموری اوور ہیڈ کو کم کرنے اور بین نوڈ کمیونیکیشن کی رفتار بہتر بنانے کے لیے ROS 2 کمپوننٹ کمپوزیشن لاگو کریں۔
- انکرپٹڈ اور تصدیق شدہ نوڈ ٹو نوڈ کمیونیکیشن کے لیے SROS2 کے ساتھ ROS 2 سیکیورٹی سیٹ اپ کریں۔
- NVIDIA Jetson ایمبیڈڈ پلیٹ فارمز کے لیے ROS 2 ورک اسپیسز کراس کمپائل کریں۔

## تصور کی وضاحت

ROS 2 وہ مڈل ویئر لیئر ہے جو روبوٹ سافٹ ویئر کو ماڈیولر ٹکڑوں میں کمیونیکیٹ کرنے دیتا ہے۔ ایک منولتھک پروگرام کی بجائے جو ہر سبسسٹم کو کنٹرل کرے، ROS 2 چھوٹے، آزاد عمل نامی **نوڈز** کو فروغ دیتا ہے۔ ہر نوڈ کا ایک واحد، واضح ذمہ داری ہوتی ہے: سینسر پڑھنا، پوز تخمینہ لگانا، راستہ منصوبہ بندی کرنا، ویلوسٹی کمانڈزublish کرنا، یا ٹاسک لائف سائیکل کا انتظام کرنا۔

### ROS 2 انسان نما روبوٹکس کے لیے کیوں اہم ہے

انسان نما روبوٹس موجودہ سب سے پیچیدہ میکاٹرونک سسٹمز میں سے ہیں۔ ایک واحد انسان نما روبوٹ کے پاس 30+ حریت کی درجات، متعدد RGB-D کیمرے، IMUs، فورس ٹارک سینسرز، LiDAR، مائیکروفون، اور ایکچویٹرز ہو سکتے ہیں جن سب کا ریئل ٹائم میں تعاون ہونا ضروری ہے۔ ROS 2 وہ **کمیونیکیشن فیبر** فراہم کرتا ہے جو اس تعاون کو عملی بناتا ہے:

- **جُدائی کی ڈیزائن**: ادراک، منصوبہ بندی، اور کنٹرول نوڈز کو آزادانہ طور پر تیار، جانچ اور ت deploy کیا جا سکتا ہے۔ ایک نئی ویژن الگورتھم نیویگیشن اسٹیک کو تبدیل کیے بغیر پرانے کی جگہ لے سکتا ہے۔
- **زبان کی بین الاپرادیتی**: C++ موشن پلانر Python ہائی لیول ٹاسک مینیجر اور Rust سیفٹی مونیٹر کے ساتھ پیغامات تبادل کر سکتا ہے۔ ROS 2 IDL (Interface Definition Language) پیغام سکیماز کو ایک بار میں بیان کرتا ہے؛ کوڈ جنریشن ٹولز C++، Python، اور دیگر معاون زبانوں کے لیے بائنڈنگز تیار کرتے ہیں۔
- **DDS ٹرانسپورٹ**: ROS 2 DDS (Data Distribution Service) کے اوپر بنایا �یا ہے، جو اصل میں دفاع اور ایروسپیس کے لیے ڈیزائن کیا گیا ایک ISO-معیاری پبلش سبسکرائب مڈل ویئر ہے۔ DDS دریافت، قابلیت اعتماد، ملٹی کاسٹ، انکرپشن، اور ریئل ٹائم شیڈولنگ فراہم کرتا ہے — صلاحیتیں جو ROS 1 میں نہیں تھیں۔
- **ٹولنگ ایکوسسٹم**: `ros2` CLI، `colcon` بلڈ ٹول، `rosbag2` ریکارڈنگ، `rviz2** ویژولائیزیشن، `tf2** کوآرڈینیٹ ٹرانس فارمز، `nav2` نیویگیشن، `MoveIt2` مینیپولیشن، اور سینکڑوں کی کمیونٹی پیکجز۔

### نوڈ گراف کا تصور

ہر چلنے والا ROS 2 سسٹم ایک جہتی گراف ہے جس میں نوڈز ایجز (ٹاپکس، سروسز، ایکشنز) سے جڑے ہوتے ہیں۔ `rqt_graph` اور `ros2 node list` / `ros2 topic list` جیسے ٹولز آپ کو رن ٹائم پر اس گراف کا جائزہ لینے دیتے ہیں۔ AI-native روبوٹکس کے لیے، ROS 2 اعلیٰ سطح کی دلیل اور روبوٹ کے رویے کے درمیان ترجمان کی طرح کام کرتا ہے۔ ایک لینگویج ماڈل فیصلہ کر سکتا ہے کہ روبوٹ کو ایک شیلف کا جائزہ لینا چاہیے، لیکن ROS 2 اس نیت کو پیغامات، اہداف، ریڈ بیک، اور کنٹرولر انٹرفیسز میں بدل دیتا ہے۔

### DDS اور rmiddleware لیئر

ROS 2 ایک پلگ ایبل مڈل ویئر لیئر متعارف کراتا ہے جسے **rmiddleware** کہا جاتا ہے۔ ڈیفالٹ پر، ROS 2 **CycloneDDS** (Ubuntu) یا **Fast DDS** (Windows/macOS) استعمال کرتا ہے، لیکن آپ ایپلیکیشن کوڈ تبدیل کیے بغیر تبدیل کر سکتے ہیں۔ مڈل ویئر کا انتظام کرتا ہے:

- **خودکار دریافت**: نوڈز نیٹ ورک پر مرکزی برکر کے بغیر ایک دوسرے کو تلاش کرتے ہیں۔
- **سیریلائزیشن**: پیغامات CDR (Common Data Representation) کا استعمال کرتے ہوئے سیریلائز کیے جاتے ہیں۔
- **ٹرانسپورٹ**: دریافت کے لیے UDP ملٹی کاسٹ، ڈیٹا کے لیے یونی کاسٹ۔ ایک مکینے کے اندر زیرو کاپی کارکردگی کے لیے م/shared میموری ٹرانسپورٹ دستیاب ہے۔
- **QoS مذاکره**: پبلشرز اور سبسکرائبرز کنکشن کے وقت مطابق کوالٹی آف سروس پروفائیلز کا مذاکرة کرتے ہیں۔

## بصری ماڈل: ROS 2 کمیونیکیشن کی قسمیں

<div className="visual-panel">
<h3>کام کی بنیاد پر کمیونیکیشن کی شکل منتخب کریں۔</h3>
<div className="textbook-grid">
<div className="textbook-card"><h3>ٹاپک</h3><p>مسلسل دھارا۔ کیمرے فریمز، آڈومیٹری، اسکین ڈیٹا، اور حالت اپ ڈیٹس کے لیے استعمال کریں۔ فائر اینڈ فارگیٹ، ملٹی ٹو ملٹی، جُدائی پیدا کرنے والا / مصرف کنندہ۔</p></div>
<div className="textbook-card"><h3>سروس</h3><p>درخواست اور جواب۔ ری سیٹ، کنفیگریشن، حالت حاصل کرنے، یا کیلیبریشن ٹرگر کرنے جیسی فوری کوئریز کے لیے استعمال کریں۔ مطابقت پذیر، ٹو ون، جواب آنے تک رک جاتا ہے۔</p></div>
<div className="textbook-card"><h3>ایکشن</h3><p>ریڈ بیک کے ساتھ طویل عرصے چلنے والا مقصد۔ نیویگیشن، مینیپولیشن، ڈاکنگ، ya انسپکشن ٹاسکس کے لیے استعمال کریں۔ غیر مطابقت پذیر، منسوخی کی معاونت، درمیانی پیشرفت اپ ڈیٹس فراہم کرتا ہے۔</p></div>
<div className="textbook-card"><h3>پیرامیٹر</h3><p>ران ٹائم کنفیگریشن۔ اسپیڈ لیمٹس، ٹاپک نامز، threshold، اور موڈز کے لیے استعمال کریں۔ نوڈ سٹارٹ اپ پر بیان کریں، `ros2 param set` یا پیرامیٹر سروس کے ذریعے ران ٹائم پر تبدیل کریں۔</p></div>
</div>
</div>

## مثال نوڈ گراف: صوتی حکم سے نیویگیشن تک

<div className="visual-panel">
<div className="visual-flow">
<div className="flow-step"><span>آڈیو نوڈ</span>مائیکروفون انپٹ → خام PCM</div>
<div className="flow-step"><span>گفتگو نوڈ</span>PCM → ASR کے ذریعے ٹیکسٹ کمانڈ</div>
<div className="flow-step"><span>نیت نوڈ</span>ٹیکسٹ → ڈھانچے دار مقصد JSON</div>
<div className="flow-step"><span>تصدیق نوڈ</span>مقصد → پابندی چیک</div>
<div className="flow-step"><span>نیویگیشن ایکشن</span>NavigateToPose مقصد → ریڈ بیک → نتیجہ</div>
<div className="flow-step"><span>مونیٹر نوڈ</span>ریڈ بیک، بحالی، ٹائم آؤٹ ہینڈلنگ</div>
</div>
</div>

## کب کون سی بنیادی چیز استعمال کریں

| ضرورت | بہترین ROS 2 بنیادی چیز | مثال | کیوں |
|---|---|---|---|
| روبوٹ کی پوز فی سیکنڈ متعدد بار پبلش کریں | ٹاپک | `/odom` | اعلیٰ فریکوئنسی، لوکسی اوکی، جُدائی پیدا کرنا |
| پوچھیں کہ نقشہ لوڈ ہوا ہے یا نہیں | سروس | `/map_server/load_map` | فوری کوئری، جواب درکار، ون شاٹ |
| روبوٹ کو ایک کمرے میں بھیجیں اور پیشرفت ٹریک کریں | ایکشن | `/navigate_to_pose` | طویل عرصے چلنے والا، ریڈ بیک درکار، منسوخ کے قابل |
| لیب کی زیادہ سے زیادہ رفتار تبدیل کریں | پیرامیٹر | `max_linear_velocity` | ران ٹائم ٹیوننگ، کوڈ تبدیلی کی ضرورت نہیں |
| 30 Hz پر کیمرے فریمز اسٹریم کریں | ٹاپک | `/camera/color/image_raw` | اعلیٰ بینڈوتھ، سبسکرائبرز کی تعداد مختلف |
| سینسر کیلیبریشن ٹرگر کریں | سروس | `/imu/calibrate` | بلاکنگ آپریشن، کامیابی کی تصدیق ضروری |
| پک اینڈ پلیس سیکوئنس انجام دیں | ایکشن | `/manipulator/pick_place` | کئی مراحل، درمیانی ریڈ بیک درکار |
| ران ٹائم پر ڈیبگ لاگنگ ٹوگل کریں | پیرامیٹر | `debug_enabled` | فوری اثر، دوبارہ سٹارٹ کی ضرورت نہیں |

## تفصیلی کوڈ مثالیں (Python rclpy)

### پبلشر نوڈ

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

### سبسکرائبر نوڈ

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

### حسب ضرورت پیغام تعریف (IDL)

`msg/HumanoidCommand.msg` فائل بنائیں:

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

Python اور C++ بائنڈنگز بنانے کے لیے `colcon build --packages-select my_interfaces` چلائیں۔

### سروس سرور

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

### سروس کلائنٹ

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

### ایکشن سرور (rclpy.action استعمال کرتے ہوئے)

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

### ایکشن کلائنٹ

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

### لانچ فائل (Python)

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

### پیرامیٹر کنفیگریشن (YAML فائل)

`config/robot_params.yaml` کے طور پر محفوظ کریں:

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

لوڈ کریں: `ros2 run my_robot_controller node --ros-args --params-file config/robot_params.yaml`

یا کوڈ میں پیرامیٹرز بیان کریں:

```python
self.declare_parameter('robot.max_linear_velocity', 0.5)
self.declare_parameter('robot.emergency_stop_distance', 0.3)
self.declare_parameter('perception.confidence_threshold', 0.75)
```

### گہرائی سے وضاحت والے زیرعنوان

### نوڈ ذمہ داری ڈیزائن

ایک ROS 2 نوڈ کا ایک واضح کام ہونا چاہیے۔ ایک واحد نوڈ بنانے سے گریز کریں جو گفتگو سنے، راستہ منصوبہ بندی کرے، کیمرے فریمز پڑھے، اور حرکت کی کمانڈز بھیجے۔ اس طرح کا منولتھک نوڈ جانچ کرنا مشکل ہے، تبدیل کرنا غیر محفوظ ہے، اور آزادانہ طور پر دوبارہ شروع کرنا ناممکن ہے۔

| نوڈ | ذمہ داری | مثال کا ڈیٹا | کمیونیکیشن |
|---|---|---|---|
| گفتگو نوڈ | آڈیو کو ٹیکسٹ میں تبدیل کرتا ہے | `"go to the kitchen"` | ٹاپک (خام آڈیو)، سروس (ASR کنفیگریشن) |
| نیت نوڈ | ٹیکسٹ کو ڈھانچے دار مقصد میں تبدیل کرتا ہے | `{room: "kitchen", task: "navigate"}` | ٹاپک (ٹیکسٹ ان), ٹاپک (مقصد آؤٹ) |
| ادراک نوڈ | آبجیکٹ یا منظر کی حالت پبلش کرتا ہے | آبجیکٹ لیبلز، اعتماد، پوز | ٹاپک (ڈیٹیکشنز)، سروس (کیپچر) |
| نیویگیشن نوڈ | راستہ کے اہداف کو عمل میں لاتا ہے | ایکشن ریڈ بیک اور نتیجہ | ایکشن (NavigateToPose) |
| سیفٹی نوڈ | پابندیاں ویلیڈیٹ کرتا ہے، ای-اسٹاپ ٹرگر کرتا ہے | روکو، سست کریں، دوبارہ منصوبہ بندی کریں | ٹاپک (cmd_vel ان)، ٹاپک (cmd_vel آؤٹ) |

### پیغام ڈیزائن کے اصول

اچھے روبوٹ پیغامات واضح ہوتے ہیں۔ `"clean room"` جیسا ابہام پورا پیغام ایک لینگویج ماڈل کے لیے آسان ہے لیکن روبوٹ انٹرفیس کے لیے خراب ہے۔ ویلیڈیٹ کیے جا سکنے والے ڈھانچے دار فیلڈز کو ترجیح دیں:

```good
# گود: واضح، ٹائپڈ، ویلیڈیٹڈ
string command_id
string target_room
string task_type        # enumerated values
float64 confidence      # bounded 0.0-1.0
float64 timeout_sec     # must be > 0
bool allow_recovery
```

```bad
# خراب: ابہام پورا، غیر ویلیڈیٹڈ
string command
```

ڈیٹا کے لیے `.msg` فائلز اور درخواست/جواب کے لیے `.srv` فائلز استعمال کریں۔ ریڈ بیک اور نتیجہ کی قسموں کے ساتھ طویل عرصے چلنے والے اہداف کے لیے `.action` فائلز استعمال کریں۔

### سروس کوالٹی (QoS) کی گہرائی

ROS 2 QoS پالیسیز پبلشرز اور سبسکرائبرز کے درمیان ڈیلیوری سیمائantics کو کنٹرول کرتی ہیں۔ یہ ریئل ٹائم روبوٹ سسٹمز کے لیے اہم ہیں۔

**قابلیت اعتماد**:
- `RELIABLE`: ڈیلیوری کی ضمانت دیتا ہے۔ گم شدہ پیغامات دوبارہ بھیجتا ہے۔ کنٹرول کمانڈز، پیرامیٹر اپ ڈیٹس، ایکشن اہداف کے لیے استعمال کریں۔ زیادہ لیٹنسی۔
- `BEST_EFFORT`: کوئی دوبارہ بھیجنا نہیں۔ کم لیٹنسی۔ سینسر اسٹریمز (LiDAR، کیمرہ، IMU) کے لیے استعمال کریں جہاں تازہ ڈیٹا مکمل ہونے سے زیادہ اہم ہے۔

**ٹھہراو**:
- `TRANSIENT_LOCAL`: دیر سے شامل ہونے والے سبسکرائبرز کو آخری N پیغامات ملتے ہیں (تاریخ کی گہرائی تک)۔ کنفیگریشن ٹاپکس، حالت براؤڈ کاسٹ کے لیے استعمال کریں۔
- `VOLATILE`: دیر سے شامل ہونے والوں کو کچھ نہیں ملتا۔ اعلیٰ فریکوئنسی سینسر ڈیٹا کے لیے استعمال کریں جہاں پرانا ڈیٹا نقصان دہ ہے۔

**تاریخ کی گہرائی**:
- `KEEP_LAST`: صرف N تازہ ترین پیغامات رکھیں (قابل ترتیب گہرائی)۔ غیر محدود قطار کی توسیع کو روکتا ہے۔
- `KEEP_ALL`: تمام پیغامات رکھیں۔ اگر سبسکرائبرز سست ہیں تو میموری مسائل پیدا کر سکتا ہے۔

**ڈیڈ لائن**:
- پیغامات کے درمیان متوقع زیادہ سے زیادہ وقفہ۔ اگر پبلشر ڈیڈ لائن چھوڑ دے، تو سبسکرائبرز کو ایونٹ کال بیک کے ذریعے مطلع کیا جاتا ہے۔ سیفٹی-کریٹیکل مانیٹرنگ کے لیے استعمال کریں۔

**جاگتا ہوا**:
- خودکار یا دستی دعویٰ کہ نوڈ زندہ ہے۔ اگر جاگنے کا لیز ختم ہو جائے، تو سبسکرائبرز کو مطلع کیا جاتا ہے۔ ٹوٹے ہوئے نوڈز کی نشاندہی کے لیے استعمال کریں۔

**مثال QoS پروفائیلز**:

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

**QoS مطابقت پذیری**: پبلشرز اور سبسکرائبرز کی QoS پالیسیز مطابق ہونی چاہئیں۔ غیر مطابق جوڑے خاموشی سے منقطع ہو جاتے ہیں۔ QoS کا جائزہ لینے اور کنکشن کے مسائل کی تشخیص کے لیے `ros2 topic info -v <topic>` استعمال کریں۔

### ROS 2 لائف سائیکل نوڈز

لائف سائیکل نوڈز ایک خصوصی نوڈ قسم ہیں (`lcl_node`) جو منظم نوڈز کے لیے ایک معیاری ریاضی مشین نافذ کرتے ہیں۔ یہ پروڈکشن روبوٹکس کے لیے ضروری ہے جہاں آپ کو یقینی سٹارٹ اپ، شٹ ڈاؤن، اور خرابی سے بحالی درکار ہے۔

**حالتیں**:
1. **غیر کنفیگرڈ** — نوڈ بنایا گیا ہے لیکن ابھی تک کنفیگر نہیں ہوا۔
2. **غیر فعال** — نوڈ کنفیگر ہے لیکن ڈیٹا پر کارروائی نہیں کر رہا۔
3. **فعال** — نوڈ مکمل طور پر کارکردہ ہے۔
4. **فائنلائزڈ** — نوڈ بند ہو رہا ہے۔
5. **خرابی** — نوڈ کو خرابی آئی۔ بحالی کی کوشش کر سکتا ہے۔

**منتقلیاں**: `configure`، `activate`، `deactivate`، `cleanup`، `shutdown`، `recover`۔

**مثال لائف سائیکل نوڈ**:

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

**لائف سائیکل مینیجر** (`nav2` / `lifecycle` پیکج سے): خودکار طور پر متعدد لائف سائیکل نوڈز میں ترتیب وار منتقلیاں ٹرگر کرتا ہے۔ پیچیدہ سٹارٹ اپ سیکوئنسز کو ترتیب دینے کے لیے ضروری۔

### کمپوننٹ کمپوزیشن

ROS 2 کمپوننٹس آپ کو ایک ہی پروسیس میں متعدد نوڈز چلنے دیتے ہیں۔ یہ گھنٹے جوڑے ہوئے نوڈز کے لیے IPC اوور ہیڈ کو ختم کرتا ہے، میموری استعمال کو کم کرتا ہے، اور زیرو کاپی انٹرا-پروسیس کمیونیکیشن کو ممکن بناتا ہے۔

**کمپوننٹ نوڈ بنانا**:

```python
from rclpy.executors import ComponentIsolatedExecutor
```

`component` پیکج اور `component_ros2` ٹول آپ کو اجازت دیتے ہیں:

1. نوڈ کو ایک شیئر لائبریری (کمپوننٹ) کے طور پر بنائیں۔
2. کمپوننٹس کو کنٹینر پروسیس میں لوڈ کریں۔
3. ایک پروسیس میں متعدد کمپوننٹس کو جوڑیں۔

**کمپوننٹ کنٹینر لانچ کرنا**:

```bash
ros2 run rclcpp_components component_container --ros-args -r __node:=my_container
ros2 component load /my_container my_package my_component::MyNode
ros2 component list  # list loaded components
```

**انٹرا-پروسیس کمیونیکیشن**: جب نوڈز ایک ہی کنٹینر میں ہوں، تو آپ زیرو کاپی پیغام پاسنگ کے لیے انٹرا-پروسیس کمیونیکشن فعال کر سکتے ہیں۔ یہ پوائنٹ کلاؤڈز یا ویڈیو اسٹریمز جیسے اعلیٰ بینڈوتھ ڈیٹا کے لیے اہم ہے جو ادراک نوڈز کے درمیان ہوتا ہے۔

### ROS 2 سیکیورٹی (SROS2)

ROS 2 Security نوڈ کمیونیکیشن کے لیے انکرپشن، تصدیق، اور رسائی کنٹرول فراہم کرتا ہے۔ یہ DDS-Security استعمال کرتا ہے، جو DDS کا ایک معیاری ایکسٹینشن ہے۔

**اہم خصوصیات**:
- **TLS انکرپشن**: تمام DDS ٹرافک ٹرانزٹ میں انکرپٹ ہوتا ہے۔
- **تصدیق**: نوڈز کو گراف میں شامل ہونے کے لیے درست سرٹیفیکیٹ پیش کرنے ہوتے ہیں۔
- **رسائی کنٹرول**: باریک رسائی والی پالیسیز کنٹرول کرتی ہیں کہ کون سے نوڈز کن سے ٹاپکس پر پبلش/سبسکرائب کر سکتے ہیں۔

**SROS2 سیٹ اپ کرنا**:

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

**SROS2 کب استعمال کریں**: غیر قابل اعتماد نیٹ ورکس میں چلنے والے پروڈکشن انسان نما روبوٹس، روبوٹ سسٹمز جہاں پیغام کی سالمیت اہم ہے، کلاؤڈ سے جڑے روبوٹس جہاں ٹیلی میٹری حساس ہے۔

### Jetson کے لیے کراس کمپائلیشن

NVIDIA Jetson (Orin، Xavier، Nano) پلیٹ فارمز انسان نما روبوٹس کے لیے سب سے عام ایمبیڈڈ ہدف ہیں۔ کراس کمپائلیشن آپ کو x86 ہوسٹ پر ROS 2 پیکجز بنانے اور ARM64 ہدف پر ڈیپلوی کرنے دیتا ہے۔

**ros_cross_compile استعمال کرنا**:

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

**Docker مبنی طریقہ**:

```bash
# Use NVIDIA's l4t container
docker run -it --runtime=nvidia \
  -v ~/robot_ws:/robot_ws \
  nvcr.io/nvidia/l4t-tensorrt:r8.5.2-runtime \
  bash

# Build inside the container
cd /robot_ws && colcon build --cmake-args -DCMAKE_BUILD_TYPE=Release
```

**اہم غور و فکر**:
- بہترین بائنریز کے لیے `-DCMAKE_BUILD_TYPE=Release` استعمال کریں۔
- ہیڈلیس Jetson بلڈز کے لیے GUI انحصارات والے پیکجز (rviz2، rqt) غیر فعال کریں۔
- صرف ضروری پیکجز بنانے کے لیے `--packages-select` استعمال کریں۔
- ڈیپلوی کے بعد ہدف پر `ros2 launch` سے جانچ کریں۔

## عملی لیب

<div className="lab-box">
<h3>لیب: ROS گراف ڈیزائن کریں</h3>
<p>اس حکم کے لیے ایک نوڈ گراف بنائیں: "Go to the kitchen and find the red cup." اس میں شامل کریں:</p>
<ul>
<li>کم از کم تین ٹاپکس (آڈیو، ادراک، حالت)۔</li>
<li>کم از کم ایک سروس (روبوٹ حالت کوئری یا کیلیبریشن)۔</li>
<li>کم از کم ایک ایکشن (NavigateToPose یا ManipulateObject)۔</li>
<li>ایک تصدیق نوڈ جو حرکت سے پہلے اعتماد چیک کرتا ہے۔</li>
<li>ایک سیفٹی نوڈ جو رکاوٹوں کی نشاندہی ہونے پر cmd_vel کو اوور رائیڈ کر سکتا ہے۔</li>
<li>کم از کم دو QoS پروفائیلز (سینسر بیسٹ-ایفورٹ، کنٹرول ریلایبل)۔</li>
</ul>
</div>

## عام ROS 2 مسائل کی تشخیص

### نوڈز ایک دوسرے کو دریافت نہیں کر سکتے

**علامت**: `ros2 topic list` ٹاپکس دکھاتا ہے لیکن `ros2 topic echo` کچھ نہیں موصول کرتا۔

**وجہیں اور حل**:
- **نیٹ ورک کنفیگریشن**: DDS دریافت کے لیے ملٹی کاسٹ استعمال کرتا ہے۔ یقینی کریں کہ `localhost` یا صحیح نیٹ ورک انٹرفیس منتخب ہے۔ `RMW_IMPLEMENTATION=rmw_cyclonedds_cpp` سیٹ کریں اور CycloneDDS XML کنفیگر کریں:
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
- **QoS عدم مطابقت**: QoS چیک کرنے کے لیے `ros2 topic info -v <topic>` استعمال کریں۔ یقینی کریں کہ پبلشرز اور سبسکرائبرز کی پروفائیلز مطابق ہیں۔
- **فائر وال**: DDS کمیونیکیشن کے لیے UDP پورٹس 7400-7500 کھلے ہونے چاہئیں۔

### پیغامات گرائے جاتے ہیں یا موصول نہیں ہوتے

**علامت**: `ros2 topic hz` متوقع فریکوئنسی دکھاتا ہے لیکن سبسکرائبر کم پیغامات موصول کرتا ہے۔

**حل**: QoS قابلیت اعتماد چیک کریں۔ اگر پبلشر `BEST_EFFORT` استعمال کرتا ہے لیکن سبسکرائبر `RELIABLE` متوقع کرتا ہے، تو وہ منصل نہیں ہوں گے۔ پروفائیلز میل کھائیں یا تشخیص کے لیے `ros2 topic info -v` استعمال کریں۔

### ایکشن سرورز اہداف موصول نہیں کر رہے

**علامت**: ایکشن کلائنٹ ایک مقصد بھیجتا ہے لیکن کبھی جواب نہیں ملتا۔

**حل**: یقینی کریں کہ ایکشن سرور چل رہا ہے اور ایکشن انٹرفیس کے نام بالکل مماثل ہیں۔ تصدیق کے لیے `ros2 action list` استعمال کریں۔ چیک کریں کہ ایکشن سرور کا `goal_callback` ایکcept ریسپانس لوٹاتا ہے۔

### پیرامیٹر تبدیلیاں اثر نہیں کر رہیں

**علامت**: `ros2 param set` کامیابی لوٹاتا ہے لیکن رویہ نہیں بدلتا۔

**حل**: تصدیق کریں کہ نوڈ پیرامیٹر بیان کرتا ہے اور اسے صحیح وقت پر پڑھتا ہے۔ کچھ پیرامیٹرز صرف ابتداء میں پڑھے جاتے ہیں (مثلاً ٹائمر مدت)۔ موجودہ قیمتیں دیکھنے کے لیے `ros2 param dump <node>` استعمال کریں۔

### لانچ فائل خرابیاں

**علامت**: `ros2 launch` درآمد کی خرابیوں یا غائب ایگزیکیوٹیبل کی وجہ سے ناکام ہوتا ہے۔

**حل**: یقینی کریں کہ پیکج بنایا گیا ہے (`colcon build`) اور سورس کیا گیا ہے (`source install/setup.bash`)۔ ایگزیکیوٹیبل ناموں کی تصدیق کے لیے `ros2 pkg executables <package_name>` استعمال کریں۔

## پروڈکشن ROS 2 کے لیے بہترین مشورے

1. **لائف سائیکل نوڈز استعمال کریں** ہر اس نوڈ کے لیے جو ہارڈ ویئر یا حالت کا انتظام کرتا ہے۔ یہ آپ کو یقینی سٹارٹ اپ اور شٹ ڈاؤن سیکوئنسز دیتا ہے۔
2. **ہمیشہ پیرامیٹرز بیان کریں** ڈیفالٹس کے ساتھ۔ کبھی بیان کیے بغیر پیرامیٹرز کی موجودگی فرض نہ کریں۔
3. **QoS پروفائیلز جان بوجھ کر استعمال کریں**۔ سینسر ڈیٹا → `BEST_EFFORT` + `VOLATILE`۔ کنٹرول کمانڈز → `RELIABLE` + `TRANSIENT_LOCAL`۔
4. **تمام آنے والے پیغامات ویلیڈیٹ کریں**۔ دیگر نوڈز سے ڈیٹا پر بغیر ٹائپس، رینجز، اور ٹائم اسٹیمپس چیک کیے بھروسہ نہ کریں۔
5. **سابسسٹمز کو الگ کرنے کے لیے نیم اسپیسز استعمال کریں**۔ `/robot/perception/camera` `/camera` سے بہتر ہے۔
6. **ڈیبگنگ اور ریگریشن ٹیسٹنگ کے لیے `rosbag2` سے ریکارڈ کریں**۔ غیر مطابق QoS کے لیے `--qos-profile-overwrite` استعمال کریں۔
7. **عام بلڈ کنفیگریشنز کے لیے `colcon mixin` استعمال کریں**: `colcon build --mixin release`۔
8. **عام کنفیگریشن مسائل چیک کرنے کے لیے `ros2 doctor` سے مانیٹر کریں**۔
9. **کوآرڈینیٹ ٹرانس فارمز کے لیے `tf2` استعمال کریں**۔ فریم کے تعلقات کو کبھی ہارڈ کوڈ نہ کریں۔
10. **پروڈکشن میں SROS2 فعال کریں**۔ غیر قابل اعتماد ڈیوائسز والے نیٹ ورک پر غیر انکرپٹڈ DDS کبھی نہ چلائیں۔
11. **کوڈ میں ٹاپک نامز ہارڈ کوڈ کرنے کی بجائے ری میپنگ کے لیے `--ros-args` استعمال کریں**۔
12. **انٹیگریشن سے پہلے ہر نوڈ کی آزادانہ طور پر جانچ کریں** `launch_testing` اور `pytest` کے ساتھ نوڈ ٹیسٹ لکھیں۔
13. **حسب ضرورت فلٹرنگ کی بجائے سینسر فیوژن کے لیے `robot_localization` استعمال کریں**۔
14. **ہارڈ ویئر پر ڈیپلوی کرنے سے پہلے `ros2 topic delay` اور `ros2 topic hz` سے کارکردگی پروفائل بنائیں**۔
15. **سسٹم کی ترقی کے ساتھ `rqt_graph` اسکرین شاٹس کے ساتھ اپنے نوڈ گراف کی دستاویزات بنائیں اور انہیں اپ ڈیٹ رکھیں**۔

## کوئز

### اپنی سمجھ جانچیں

1. کون سی ROS 2 بنیادی چیز کیمرے فریمز کے لیے بہترین ہے؟
1. کون سی بنیادی چیز طویل عرصے چلنے والے نیویگیشن مقصد کے لیے بہترین ہے؟
1. AI پلانر کو براہ راست موشن کمانڈز کی بجائے ڈھانچے دار اہداف کیوں بنانے چاہئیں؟
1. rclpy Python کوڈ کو کیا کرنے دیتا ہے؟
1. DDS کیا ہے اور ROS 2 اسے کیوں استعمال کرتا ہے؟
1. `RELIABLE` اور `BEST_EFFORT` QoS میں کیا فرق ہے؟
1. آپ عام نوڈ کی بجائے لائف سائیکل نوڈ کب استعمال کریں گے؟
1. کمپوننٹ کمپوزیشن کون سا حل کرتا ہے؟
1. آپ ROS 2 میں انکرپشن کیسے فعال کرتے ہیں؟
1. کنٹرول کمانڈ ٹاپک کے لیے صحیح QoS پروفائل کیا ہے؟
1. آپ پروڈکشن کوڈ میں ٹاپک نامز ہمیشہ کیوں ہارڈ کوڈ نہیں کر سکتے؟
1. آپ ایک ٹاپک پر QoS مطابقت پذیری کا جائزہ لینے کے لیے کون سا ٹول استعمال کرتے ہیں؟

### جوابات

1. ایک ٹاپک — اعلیٰ فریکوئنسی، جُدائی پیدا کرنے والا، لوکسی اوکی سینسر اسٹریم۔
1. ایک ایکشن — طویل عرصے چلنے والا، ریڈ بیک درکار، منسوخی کی معاونت۔
1. ڈھانچے دار اہداف کو ویلیڈیٹ، محدود، مانیٹر، اور کنٹرولرز کے ذریعے محفوظ طریقے سے ترجمہ کیا جا سکتا ہے۔ یہ ٹائپ چیکنگ اور ران ٹائم پیرامیٹر ٹیوننگ کو بھی ممکن بناتے ہیں۔
1. یہ Python پروگراموں کو `rclpy` کلائنٹ لائبریری کا استعمال کرتے ہوئے ROS 2 نوڈز، پبلشرز، سبسکرائبرز، سروسز، ایکشنز، اور پیرامیٹرز بنانے دیتا ہے۔
1. DDS (Data Distribution Service) ایک ISO-معیاری پبلش سبسکرائب مڈل ویئر ہے جو دریافت، قابلیت اعتماد، ملٹی کاسٹ، انکرپشن، اور ریئل ٹائم شیڈولنگ فراہم کرتا ہے۔ ROS 2 اسے ٹرانسپورٹ لیئر کے طور پر استعمال کرتا ہے تاکہ ایپلیکیشن کوڈ نیٹ ورکنگ تفصیلات سے جُدا ہو۔
1. `RELIABLE` دوبارہ بھیج کر ڈیلیوری کی ضمانت دیتا ہے (زیادہ لیٹنسی)۔ `BEST_EFFORT` گم شدہ پیکٹس گرتا ہے (کم لیٹنسی)۔ کمانڈز کے لیے ریلایبل، سینسرز کے لیے بیسٹ-ایفورٹ استعمال کریں۔
1. لائف سائیکل نوڈز تب استعمال کریں جب آپ کو یقینی سٹارٹ اپ/شٹ ڈاؤن سیکوئنسز، منظم منتقلیاں، یا خرابی سے بحالی درکار ہو — خاص طور پر ہارڈ ویئر انٹرفیسز یا پروڈک션 سسٹمز کے لیے۔
1. کمپوننٹ کمپوزیشن ایک ہی پروسیس میں متعدد نوڈز چلا کر IPC اوور ہیڈ کو ختم کرتا ہے، زیرو کاپی انٹرا-پروسیس کمیونیکشن کو ممکن بناتا ہے، اور میموری استعمال کو کم کرتا ہے۔
1. SROS2 (ROS 2 Security) استعمال کریں جو DDS-Security کے ذریعے TLS انکرپشن، نوڈ تصدیق، اور رسائی کنٹرول پالیسیز فراہم کرتا ہے۔
1. `RELIABLE` + `TRANSIENT_LOCAL` ٹھہراو، 10-20 پیغامات کی تاریخ کی گہرائی کے ساتھ۔
1. ہارڈ کوڈنگ نوڈز کو غیر لچکدار بناتا ہے اور ٹاپک نامز بدلنے پر توڑ دیتا ہے۔ ری میپنگ کے لیے `--ros-args -r` اور کنفیگریشن کے لیے `--params-file` استعمال کریں۔
1. `ros2 topic info -v <topic>` اس ٹاپک پر تمام پبلشرز اور سبسکرائبرز کی QoS پروفائیلز دکھاتا ہے اور عدم مطابقوں کو نمایاں کرتا ہے۔

## سیفٹی اور ہارڈ ویئر نوٹس

<div className="safety-box">
<h3>کنٹرول کی حد</h3>
<p>AI لیئر ایک مقصد تجویز کر سکتا ہے۔ ROS 2 کنٹرولرز فیصلہ کرتے ہیں کہ وہ مقصد کیسے حرکت بن جاتا ہے۔ اسپیڈ لیمٹس، ٹکراو کی جانچ، اور ایمرجنسی اسٹاپ رویہ کو لینگویج ماڈل کے باہر رکھیں۔ سیفٹی نوڈ ایک الگ، آزادانہ طور پر جانچ کے قابل ROS 2 نوڈ ہونا چاہیے جو کسی بھی وقت cmd_vel کو اوور رائیڈ کر سکتا ہے۔</p>
</div>

## لغت

| اصطلاح | تعریف |
|---|---|
| **ROS 2** | Robot Operating System 2 — روبوٹ سافٹ ویئر کی ترقی کے لیے ایک مفت مڈل ویئر فریم ورک، DDS پر مبنی۔ |
| **نوڈ** | ایک عمل جو ROS 2 سسٹم میں ایک واحد، واضح فنکشن انجام دیتا ہے۔ |
| **ٹاپک** | پبلش/سبسکرائب پیغامات کے لیے ایک نام دار، ٹائپڈ کمیونیکیشن چینل۔ |
| **سروس** | دو نوڈز کے درمیان ایک مطابقت پذیر درخواست/جواب کمیونیکیشن میکانزم۔ |
| **ایکشن** | مقصد، ریڈ بیک، اور نتیجہ مراحل کے ساتھ ایک غیر مطابقت پذیر، طویل عرصے چلنے والا ٹاسک۔ |
| **پیرامیٹر** | ایک قابل ترتیب قیمت جو کوڈ تبدیل کیے بغیر ران ٹائم پر سیٹ کی جا سکتی ہے۔ |
| **لانچ فائل** | ایک اسکرپٹ جو مخصوص کنفیگریشنز کے ساتھ متعدد نوڈز شروع کرتا ہے۔ |
| **rclpy** | Python کے لیے ROS 2 کلائنٹ لائبریری — ROS 2 کا Python API۔ |
| **DDS** | Data Distribution Service — ISO-معیاری پبلش سبسکرائب مڈل ویئر جو ROS 2 ٹرانسپورٹ کے لیے استعمال کرتا ہے۔ |
| **QoS** | Quality of Service — قابلیت اعتماد، ٹھہراو، تاریخ، ڈیڈ لائن، اور جاگنے کو کنٹرول کرنے والی پالیسیز۔ |
| **لائف سائیکل نوڈ** | سٹارٹ اپ، شٹ ڈاؤن، اور خرابی سے بحالی کے لیے معیاری ریاضی مشین والا ایک منظم نوڈ۔ |
| **کمپوننٹ** | ایک لوڈ کرنے والی نوڈ لائبریری جسے زیرو کاپی IPC کے لیے کنٹینر پروسیس میں جوڑا جا سکتا ہے۔ |
| **SROS2** | ROS 2 Security — DDS کمیونیکیشن کے لیے انکرپشن، تصدیق، اور رسائی کنٹرول۔ |
| **colcon** | پیکجز بنانے، جانچنے، اور انسٹال کرنے کا ROS 2 بلڈ ٹول۔ |
| **rosbag2** | ڈیبگنگ اور ٹیسٹنگ کے لیے ROS 2 پیغام ڈیٹا ریکارڈ اور ری پلے کرنے کا ٹول۔ |
| **tf2** | روبوٹ لنکس اور سینسرز کے درمیان کوآرڈینیٹ فریم ٹرانس فارمز کے انتظام کے لیے ایک لائبریری۔ |
| **IDL** | Interface Definition Language — ROS 2 پیغامات، سروسز، اور ایکشنز کے لیے سکیما فارمیٹ۔ |
| **CDR** | Common Data Representation — پیغام انکوڈنگ کے لیے DDS استعمال کرنے والا سیریلائزیشن فارمیٹ۔ |
| **rmiddleware** | ROS 2 میں پلگ ایبل مڈل ویئر ایبسٹریکشن لیئر جو DDS کی تبدیلی کی اجازت دیتا ہے۔ |
| **CycloneDDS** | ایک مفت DDS تعمیل جو عام طور پر ROS 2 میں ڈیفالٹ RMW کے طور پر استعمال ہوتا ہے۔ |
| **Fast DDS** | eProsima سے ایک مفت DDS تعمیل، کچھ پلیٹ فارمز پر ڈیفالٹ RMW کے طور پر استعمال ہوتا ہے۔ |
| **ری میپنگ** | ROS 2 کا میکانزم جو لانچ ٹائم پر ٹاپکس، سروسز، اور پیرامیٹرز کو کوڈ تبدیلی کے بغیر نام بدلنے دیتا ہے۔ |
| **نیم اسپیس** | ایک منطقی گروپنگ پریفکس جو سابسسٹم کی الگائی کے لیے نوڈ نامز اور ٹاپک نامز پر لاگو ہوتا ہے۔ |
| **cmd_vel** | روبوٹ کنٹرولرز کو بھیجی گئی ویلوسٹی کمانڈز (`geometry_msgs/msg/Twist`) کا معیاری ٹاپک نام۔ |
| **آڈوم** | آڈومیٹری ڈیٹا — چھکی کے انکوڈرز یا وژوال آڈومیٹری سے روبوٹ کی پوز تخمینہ کا معیاری ٹاپک نام۔ |
| **IMU** | Inertial Measurement Unit — تیزی اور زاویہ ویلوسٹی ڈیٹا فراہم کرنے والا سینسر۔ |
| **LiDAR** | Light Detection and Ranging — نقشہ بندی اور رکاوٹ کی نشاندہی کے لیے لیزر مبنی رینج سینسر۔ |
| **Jetson** | NVIDIA Jetson فیملی — عام طور پر موبائل روبوٹ پروسیسنگ کے لیے استعمال ہونے والے ایمبیڈڈ ARM64 کمپیوٹنگ پلیٹ فارمز۔ |
| **کراس کمپائلیشن** | ایک پلیٹ فارم (x86) پر سافٹ ویئر بنانا مختلف پلیٹ فارم (ARM64 Jetson) پر ایگزیکیوشن کے لیے۔ |
