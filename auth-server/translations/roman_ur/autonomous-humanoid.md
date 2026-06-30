---
sidebar_position: 1
title: Autonomous Humanoid Capstone
description: Capstone project — integrate speech recognition, LLM task planning, autonomous navigation, computer vision, and robotic manipulation into a complete simulated humanoid workflow with ROS 2, Gazebo, Nav2, and VLA pipelines.
keywords: [capstone project, autonomous humanoid, speech recognition, LLM planning, robot navigation, computer vision, manipulation, ROS 2, Gazebo, Nav2, VLA pipeline, task decomposition, object detection, grasp planning, hackathon, digital twin]
---

import PersonalizationToolbar from '@site/src/components/Personalization/PersonalizationToolbar';

# Autonomous Humanoid Capstone

<PersonalizationToolbar chapterSlug="capstone/autonomous-humanoid" />

## Seekhne ke nataij

- Bayan karein ke awaz ki pehchan, LLM mansooba bandi, idrak, navigation aur handling ek mukammal khudkar humanoid workflow mein kaise milte hain.
- Ek soti hukm ko kham audio se neyat ki tashreeh, hadaf shuda task decomposition, ROS 2 action dispatch, target detection, grasp execution aur natije ki tasdeeq tak trace karein.
- Zaban ke output aur physical motion ke darmiyan har tasdeeqi gate ki shanakht karein aur wazahat karein ke har gate kyun maujood hai.
- Ek capstone demo design karein jo engineering tradeoffs aur failure modes ko zahir kare unhein chhupane ki bajaye.
- Ek mukammal ROS 2 launch file laagu karein jo parameterized configuration ke saath tamam capstone subsystems shuru kare.
- Workflow ki har parrhat par recovery behavior, timeout handling aur hifazati pabandiyon ka jaiza lein.
- Sirf simulation ki tasdeeq ko hardware transfer ki zarooriyat se muwazna karein aur wazahat karein ke kya badalna zaroori hai.

## Tasawwur ki wazahat

Capstone poore course ko ek mukammal simulated humanoid workflow mein jodta hai. Sarif ek hukm bolta hai. Robot sunta hai, neyat ko samajhta hai, neyat ko bund task mein taqseem karta hai, navigation rasta mansooba bandi karta hai, rukawaton se bachta hai, computer vision ka istemal karte hue target object ki shanakht karta hai, object ko handle karta hai aur natije ki tasdeeq karta hai. Agar koi marhala nakaam ho jata hai, to robot bejaah aage badhne ki bajaye recovery raste mein daakhil hota hai.

Integration woh bunyadi maharat hai jis ka yeh mansooba jaiza leta hai. Awaz ki pehchan, LLMs, ROS 2 ya computer vision ka alag thilg ilm nakaafi hai. Mushkil masail hadood par rehte hain: ghair hadaf shuda zaban ko hadaf shuda ahdaaf mein tabdeel karna jinhen controllers tasdeeq kar sakte hain, oonchi satah ke mansoobon ko timeout aur feedback monitoring ke saath ROS 2 action goals mein tarjuma karna, zaban ke hawalon ko idrak kardash objects se jorna, aur yeh tasdeeq karna ke physical halat matlabia natije se milti hai.

Ek mazboot capstone system ki hudood ko namaya banata hai. Har subsystem — awaz, mansooba bandi, idrak, navigation, handling, tasdeeq — ke paas waze input, waze output, aur waze failure mode hota hai. Demo ko judges ko dikhana chahiye ke robot kya sochta hai, us ne kya faisla kiya, us ne kya karne ki koshish ki, aur kya woh kamyab hua. Baghair dikhaai dene wali logic ke satah se motion integration ka khatra hai, demo ki taqat nahi.

Workflow pehle simulation mein chalta hai. Gazebo physics, sensor models, collision geometry aur maholiyati interaction faraham karta hai. ROS 2 communication middleware faraham karta hai: nodes, topics, services, actions aur parameters. Nav2 khudkar navigation sambhalta hai. Vision-Language-Action bridge zaban ki samajh ko robot ke amal se jodta hai. Natija ek test karne, debug karne aur dikhane ke qabil khudkar system hai.

## Visual model: capstone architecture

<div className="visual-panel">
<h3>Capstone workflow ki tamam saat parrhatein</h3>
<div className="visual-flow">
<div className="flow-step"><span>1. Sunna</span>Microphone kham audio qabz karta hai, Whisper text mein tabdeel karta hai</div>
<div className="flow-step"><span>2. Tashreeh</span>Text amal, object, muqam aur pabandiyon ke saath hadaf shuda neyat ban jata hai</div>
<div className="flow-step"><span>3. Mansooba bandi</span>LLM neyat ko bund, tarteeb wali, tasdeeq shuda tasks mein taqseem karta hai</div>
<div className="flow-step"><span>4. Navigation</span>ROS 2 Nav2 action rukawat se bachao aur dobara mansooba bandi ke saath rasta chalata hai</div>
<div className="flow-step"><span>5. Dekhna</span>YOLO ya RT-DETR target object ko itminan aur 6-DoF pose ke saath pakadta hai</div>
<div className="flow-step"><span>6. Amal karna</span>Handler rasai, grasp, uthana aur rakhna force monitoring ke saath anjam deta hai</div>
<div className="flow-step"><span>7. Tasdeeq</span>System natije ki halat check karta hai aur zaroorat par recovery trigger karta hai</div>
</div>
</div>

## Capstone ki zarooriyat matrix

| Zaroorat | Demo mein saboot | Failure ka amal | Tasdeeqi gate |
|---|---|---|---|
| Soti hukm qubool | Transcript log mein zahir | Sarif se dohrane ko kahen, 10s ke baad timeout | Audio energy had, transcription itminan |
| Niyat ki tashreeh | Hadaf shuda JSON zahir | Ghair wazeh hukm mustarad, wazahat ki darkhwast | Schema tasdeeq, zaroori field check |
| Mansooba tayyar | Qadam fehrist numaya aur bund | Namuna ya had se tajawuz karne wala mansooba mustarad | Zyada se zyada qadam ginti, action whitelist, timeout |
| Rasta mansooba bandi | Robot ka rasta Gazebo mein dikhaya | Rukawat par dobara mansooba bandi ya ruk jayen | Nav2 costmap, rukawat ki wazahat |
| Object ki shanakht | Label aur itminan dikhaya | Dobara scan, wazahat ki darkhwast, ya mansookh | Itminan had, bounding box ki durustagi |
| Handling ki koshish | Robot rasai aur grasp mehfooz tareeqe se karta hai | Naqabil rasai ya force zyada hone par mansookh | Workspace ki hadood, force had |
| Natije ki tasdeeq | Haalat hal ko ke khilaf check | Namukammal task ki report, dobara koshish ki tajweez | Tasdeeqi raseed, force sensor check |

## Code misalein

### Capstone ke liye mukammal ROS 2 launch file

```python
# capstone_launch.py
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription, LogInfo
from launch.conditions import IfCondition
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():
    use_sim_time = LaunchConfiguration('use_sim_time', default='true')
    model_path = LaunchConfiguration('model_path', default='models/yolov8n.pt')
    whisper_model = LaunchConfiguration('whisper_model', default='base')
    llm_endpoint = LaunchConfiguration('llm_endpoint', default='http://localhost:11434/api/generate')
    nav_timeout = LaunchConfiguration('nav_timeout', default='60.0')
    grasp_force_limit = LaunchConfiguration('grasp_force_limit', default='15.0')
    confidence_threshold = LaunchConfiguration('confidence_threshold', default='0.65')

    return LaunchDescription([
        DeclareLaunchArgument('use_sim_time', default_value='true'),
        DeclareLaunchArgument('model_path', default_value='models/yolov8n.pt'),
        DeclareLaunchArgument('whisper_model', default_value='base'),
        DeclareLaunchArgument('llm_endpoint', default_value='http://localhost:11434/api/generate'),
        DeclareLaunchArgument('nav_timeout', default_value='60.0'),
        DeclareLaunchArgument('grasp_force_limit', default_value='15.0'),
        DeclareLaunchArgument('confidence_threshold', default_value='0.65'),

        LogInfo(msg=['Starting Autonomous Humanoid Capstone with sim_time=', use_sim_time]),

        # Speech recognition node
        Node(
            package='capstone_humanoid',
            executable='speech_node',
            name='speech_recognizer',
            parameters=[{
                'use_sim_time': use_sim_time,
                'whisper_model': whisper_model,
                'language': 'en',
                'energy_threshold': 300,
                'pause_threshold': 0.8,
                'phrase_timeout': 10.0,
            }],
            output='screen',
        ),

        # Intent parser and task planner node
        Node(
            package='capstone_humanoid',
            executable='planner_node',
            name='task_planner',
            parameters=[{
                'use_sim_time': use_sim_time,
                'llm_endpoint': llm_endpoint,
                'max_plan_steps': 8,
                'allowed_actions': ['navigate', 'detect', 'grasp', 'place', 'scan'],
                'plan_timeout': 15.0,
                'safety_check_enabled': True,
            }],
            output='screen',
        ),

        # Object detection node
        Node(
            package='capstone_humanoid',
            executable='detection_node',
            name='object_detector',
            parameters=[{
                'use_sim_time': use_sim_time,
                'model_path': model_path,
                'confidence_threshold': confidence_threshold,
                'camera_topic': '/camera/color/image_raw',
                'depth_topic': '/camera/depth/image_raw',
                'detection_rate_hz': 10.0,
            }],
            output='screen',
        ),

        # Navigation action client node
        Node(
            package='capstone_humanoid',
            executable='navigation_node',
            name='navigation_client',
            parameters=[{
                'use_sim_time': use_sim_time,
                'nav_action_topic': '/navigate_to_pose',
                'nav_timeout': nav_timeout,
                'recovery_enabled': True,
                'max_replanning_attempts': 3,
                'goal_tolerance_m': 0.3,
            }],
            output='screen',
        ),

        # Manipulation node
        Node(
            package='capstone_humanoid',
            executable='manipulation_node',
            name='manipulator',
            parameters=[{
                'use_sim_time': use_sim_time,
                'grasp_force_limit': grasp_force_limit,
                'arm_controller_topic': '/arm_controller/follow_joint_trajectory',
                'gripper_topic': '/gripper_controller/command',
                'reach_timeout': 10.0,
            }],
            output='screen',
        ),

        # Verification and recovery node
        Node(
            package='capstone_humanoid',
            executable='verification_node',
            name='outcome_verifier',
            parameters=[{
                'use_sim_time': use_sim_time,
                'verification_timeout': 5.0,
                'visual_check_enabled': True,
                'force_check_enabled': True,
                'recovery_strategy': 'retry_then_report',
                'max_retries': 2,
            }],
            output='screen',
        ),

        # Demo orchestrator node
        Node(
            package='capstone_humanoid',
            executable='orchestrator_node',
            name='demo_orchestrator',
            parameters=[{
                'use_sim_time': use_sim_time,
                'demo_mode': 'full_autonomous',
                'log_level': 'INFO',
                'instrumentation_enabled': True,
                'status_topic': '/capstone/status',
            }],
            output='screen',
        ),
    ])
```

### Soti hukm processing workflow

```python
# speech_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import sounddevice as sd
import numpy as np
from faster_whisper import WhisperModel
import webrtcvad
import queue
import threading


class SpeechRecognizer(Node):
    def __init__(self):
        super().__init__('speech_recognizer')
        self.declare_parameter('whisper_model', 'base')
        self.declare_parameter('energy_threshold', 300)
        self.declare_parameter('pause_threshold', 0.8)
        self.declare_parameter('phrase_timeout', 10.0)
        self.declare_parameter('language', 'en')

        model_size = self.get_parameter('whisper_model').value
        self.whisper = WhisperModel(model_size, device='cpu', compute_type='int8')

        self.publisher_ = self.create_publisher(String, '/capstone/speech/transcript', 10)
        self.status_pub = self.create_publisher(String, '/capstone/speech/status', 10)
        self.audio_queue = queue.Queue()
        self.vad = webrtcvad.Vad(3)
        self.is_listening = False
        self.audio_buffer = []
        self.silence_frames = 0

        self.publish_status('ready')
        self.start_audio_stream()
        self.get_logger().info(f'Speech recognizer initialized with model={model_size}')

    def start_audio_stream(self):
        self.is_listening = True
        stream = sd.InputStream(
            samplerate=16000,
            channels=1,
            dtype='int16',
            blocksize=480,
            callback=self.audio_callback,
        )
        self.audio_stream = stream
        stream.start()
        thread = threading.Thread(target=self.process_audio_loop, daemon=True)
        thread.start()
        self.publish_status('listening')

    def audio_callback(self, indata, frames, time_info, status):
        self.audio_queue.put(indata.copy())

    def process_audio_loop(self):
        energy_threshold = self.get_parameter('energy_threshold').value
        pause_threshold = self.get_parameter('pause_threshold').value
        phrase_timeout = self.get_parameter('phrase_timeout').value

        while self.is_listening:
            chunk = self.audio_queue.get()
            audio_int16 = chunk.flatten()
            energy = np.abs(audio_int16).mean()

            is_speech = energy > energy_threshold
            if is_speech:
                self.silence_frames = 0
                self.audio_buffer.append(audio_int16)
            else:
                self.silence_frames += 1

            silence_duration = self.silence_frames * (480 / 16000)
            buffer_duration = len(self.audio_buffer) * (480 / 16000)

            if buffer_duration > 0.5 and silence_duration >= pause_threshold:
                audio_data = np.concatenate(self.audio_buffer)
                self.audio_buffer = []
                self.silence_frames = 0
                self.transcribe(audio_data)

            if buffer_duration > phrase_timeout:
                self.audio_buffer = []
                self.silence_frames = 0
                self.get_logger().warn('Phrase timeout reached, clearing buffer')

    def transcribe(self, audio_int16):
        self.publish_status('transcribing')
        audio_float32 = audio_int16.astype(np.float32) / 32768.0

        language = self.get_parameter('language').value
        segments, info = self.whisper.transcribe(
            audio_float32,
            language=language,
            beam_size=5,
            vad_filter=True,
        )

        full_text = ' '.join(segment.text.strip() for segment in segments).strip()
        if not full_text:
            self.publish_status('listening')
            return

        msg = String()
        msg.data = full_text
        self.publisher_.publish(msg)
        self.get_logger().info(f'Transcribed: "{full_text}" (lang={info.language}, prob={info.language_probability:.2f})')
        self.publish_status('listening')

    def publish_status(self, status):
        msg = String()
        msg.data = status
        self.status_pub.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    node = SpeechRecognizer()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### LLM task decomposition prompt template

```python
# planner_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped
import json
import requests
import time


PLANNING_PROMPT = """You are a robot task planner. Convert the user's voice command into a bounded, ordered plan.

CONSTRAINTS:
- You may ONLY use these actions: navigate, detect, grasp, place, scan
- Each step must have: action, target, parameters, timeout_seconds, success_criteria
- Maximum 8 steps per plan
- Every plan must end with a verify step
- Reject commands that are unsafe, unclear, or exceed robot capabilities

COMMAND: "{command}"

AVAILABLE OBJECTS IN SCENE: {objects}
ROBOT WORKSPACE: x=[-2.0, 2.0], y=[-2.0, 2.0], z=[0.0, 1.5]
GRASPABLE HEIGHT RANGE: z=[0.4, 1.2]

RESPOND WITH VALID JSON:
{{
  "valid": true,
  "intent_summary": "Brief description of what the user wants",
  "steps": [
    {{
      "step_id": 1,
      "action": "navigate|detect|grasp|place|scan",
      "target": "object or location reference",
      "parameters": {{}},
      "timeout_seconds": 30,
      "success_criteria": "what confirms this step succeeded"
    }}
  ],
  "safety_notes": ["any safety concerns"],
  "fallback": "what to do if the plan fails"
}}

If the command is unsafe or unclear, respond with:
{{
  "valid": false,
  "reason": "explanation of why the plan cannot proceed",
  "suggestion": "what the user should say instead"
}}
"""


class TaskPlanner(Node):
    def __init__(self):
        super().__init__('task_planner')
        self.declare_parameter('llm_endpoint', 'http://localhost:11434/api/generate')
        self.declare_parameter('max_plan_steps', 8)
        self.declare_parameter('allowed_actions', ['navigate', 'detect', 'grasp', 'place', 'scan'])
        self.declare_parameter('plan_timeout', 15.0)
        self.declare_parameter('safety_check_enabled', True)

        self.llm_endpoint = self.get_parameter('llm_endpoint').value
        self.max_steps = self.get_parameter('max_plan_steps').value
        self.allowed_actions = self.get_parameter('allowed_actions').value

        self.plan_pub = self.create_publisher(String, '/capstone/planner/plan', 10)
        self.goal_pub = self.create_publisher(String, '/capstone/planner/goals', 10)
        self.status_pub = self.create_publisher(String, '/capstone/planner/status', 10)

        self.subscription = self.create_subscription(
            String, '/capstone/speech/transcript', self.on_command_received, 10
        )

        self.get_logger().info('Task planner ready')
        self.publish_status('ready')

    def on_command_received(self, msg):
        command = msg.data
        self.get_logger().info(f'Planning for command: "{command}"')
        self.publish_status('planning')

        plan = self.generate_plan(command)
        if plan is None:
            self.publish_status('planning_failed')
            return

        if not self.validate_plan(plan):
            self.get_logger().error('Plan validation failed')
            self.publish_status('validation_failed')
            return

        self.publish_plan(plan)
        self.publish_goals(plan)
        self.publish_status('plan_ready')

    def generate_plan(self, command):
        prompt = PLANNING_PROMPT.format(
            command=command,
            objects=self.get_scene_objects(),
        )

        try:
            response = requests.post(
                self.llm_endpoint,
                json={
                    'model': 'llama3.2',
                    'prompt': prompt,
                    'stream': False,
                    'options': {
                        'temperature': 0.3,
                        'num_predict': 1024,
                    },
                },
                timeout=self.get_parameter('plan_timeout').value,
            )
            response.raise_for_status()
            plan_text = response.json().get('response', '')
            return json.loads(plan_text)
        except (requests.RequestException, json.JSONDecodeError) as e:
            self.get_logger().error(f'LLM call failed: {e}')
            return None

    def get_scene_objects(self):
        return ['red_cup', 'blue_bottle', 'white_plate', 'green_box']

    def validate_plan(self, plan):
        if not plan.get('valid', False):
            self.get_logger().warn(f'Plan rejected: {plan.get("reason", "unknown")}')
            return False

        steps = plan.get('steps', [])
        if len(steps) > self.max_steps:
            self.get_logger().error(f'Plan has {len(steps)} steps, max is {self.max_steps}')
            return False

        for step in steps:
            action = step.get('action', '')
            if action not in self.allowed_actions:
                self.get_logger().error(f'Action "{action}" not in allowed list')
                return False
            if step.get('timeout_seconds', 0) > 60:
                self.get_logger().warn(f'Step timeout {step["timeout_seconds"]}s exceeds 60s limit')
                step['timeout_seconds'] = 60

        return True

    def publish_plan(self, plan):
        msg = String()
        msg.data = json.dumps(plan, indent=2)
        self.plan_pub.publish(msg)

    def publish_goals(self, plan):
        goals = []
        for step in plan.get('steps', []):
            if step['action'] == 'navigate':
                goals.append({
                    'type': 'navigation',
                    'target': step.get('target', ''),
                    'step_id': step.get('step_id', 0),
                })
            elif step['action'] == 'grasp':
                goals.append({
                    'type': 'manipulation',
                    'target': step.get('target', ''),
                    'step_id': step.get('step_id', 0),
                })
        msg = String()
        msg.data = json.dumps(goals)
        self.goal_pub.publish(msg)

    def publish_status(self, status):
        msg = String()
        msg.data = status
        self.status_pub.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    node = TaskPlanner()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Navigation goal action client

```python
# navigation_node.py
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from std_msgs.msg import String
from nav2_msgs.action import NavigateToPose
from geometry_msgs.msg import PoseStamped, PoseWithCovarianceStamped
import json
import time


class NavigationClient(Node):
    def __init__(self):
        super().__init__('navigation_client')
        self.declare_parameter('nav_action_topic', '/navigate_to_pose')
        self.declare_parameter('nav_timeout', 60.0)
        self.declare_parameter('recovery_enabled', True)
        self.declare_parameter('max_replanning_attempts', 3)
        self.declare_parameter('goal_tolerance_m', 0.3)

        self.nav_client = ActionClient(
            self, NavigateToPose, self.get_parameter('nav_action_topic').value
        )

        self.plan_sub = self.create_subscription(
            String, '/capstone/planner/plan', self.on_plan_received, 10
        )
        self.pose_sub = self.create_subscription(
            PoseWithCovarianceStamped, '/amcl_pose', self.on_pose_received, 10
        )

        self.status_pub = self.create_publisher(String, '/capstone/nav/status', 10)
        self.feedback_pub = self.create_publisher(String, '/capstone/nav/feedback', 10)

        self.current_pose = None
        self.current_goal_handle = None
        self.replan_count = 0

        self.get_logger().info('Navigation client ready')
        self.publish_status('ready')

    def on_pose_received(self, msg):
        self.current_pose = msg.pose.pose

    def on_plan_received(self, msg):
        plan = json.loads(msg.data)
        steps = [s for s in plan.get('steps', []) if s.get('action') == 'navigate']
        if not steps:
            self.get_logger().info('No navigation steps in plan')
            return
        self.execute_navigation_sequence(steps)

    def execute_navigation_sequence(self, nav_steps):
        for step in nav_steps:
            target = step.get('target', '')
            self.get_logger().info(f'Navigating to: {target}')
            self.publish_status('navigating')

            goal = self.create_navigation_goal(target)
            if goal is None:
                self.get_logger().error(f'Could not create goal for target: {target}')
                self.publish_status('goal_creation_failed')
                continue

            success = self.send_and_wait_for_goal(goal)
            if not success and self.get_parameter('recovery_enabled').value:
                self.attempt_recovery(goal)

    def create_navigation_goal(self, target):
        target_map = {
            'kitchen': (1.5, 0.5, 0.0),
            'table': (0.0, 1.0, 0.0),
            'shelf': (-1.0, 1.5, 1.57),
            'room_center': (0.0, 0.0, 0.0),
        }

        if target not in target_map:
            self.get_logger().error(f'Unknown target location: {target}')
            return None

        x, y, theta = target_map[target]
        goal = NavigateToPose.Goal()
        goal.pose.header.frame_id = 'map'
        goal.pose.header.stamp = self.get_clock().now().to_msg()
        goal.pose.pose.position.x = x
        goal.pose.pose.position.y = y
        goal.pose.pose.position.z = 0.0
        goal.pose.pose.orientation.z = __import__('math').sin(theta / 2)
        goal.pose.pose.orientation.w = __import__('math').cos(theta / 2)
        return goal

    def send_and_wait_for_goal(self, goal):
        if not self.nav_client.wait_for_server(timeout_sec=5.0):
            self.get_logger().error('Nav2 action server not available')
            return False

        send_goal_future = self.nav_client.send_goal_async(goal)
        rclpy.spin_until_future_complete(self, send_goal_future, timeout_sec=10.0)

        goal_handle = send_goal_future.result()
        if not goal_handle.accepted:
            self.get_logger().error('Goal rejected by navigation server')
            return False

        self.current_goal_handle = goal_handle
        self.get_logger().info('Navigation goal accepted')

        result_future = goal_handle.get_result_async()
        feedback_period = goal_handle.feedback_callback
        deadline = time.time() + self.get_parameter('nav_timeout').value

        while rclpy.ok() and time.time() < deadline:
            rclpy.spin_once(self, timeout_sec=0.1)
            if result_future.done():
                break

        if not result_future.done():
            self.get_logger().warn('Navigation timed out, canceling goal')
            goal_handle.cancel_goal_async()
            return False

        result = result_future.result()
        success = result.status == 4
        self.publish_feedback(f'Navigation result: status={result.status}, success={success}')
        return success

    def attempt_recovery(self, original_goal):
        max_attempts = self.get_parameter('max_replanning_attempts').value
        while self.replan_count < max_attempts:
            self.replan_count += 1
            self.get_logger().warn(f'Recovery attempt {self.replan_count}/{max_attempts}')
            self.publish_status(f'recovery_attempt_{self.replan_count}')

            time.sleep(1.0)
            self.send_and_wait_for_goal(original_goal)

        self.get_logger().error('All recovery attempts exhausted')
        self.publish_status('navigation_failed')
        self.replan_count = 0

    def publish_status(self, status):
        msg = String()
        msg.data = status
        self.status_pub.publish(msg)

    def publish_feedback(self, feedback):
        msg = String()
        msg.data = feedback
        self.feedback_pub.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    node = NavigationClient()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Object detection aur grasp workflow

```python
# detection_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Float32
from sensor_msgs.msg import Image, CameraInfo
from vision_msgs.msg import Detection2DArray, Detection2D, ObjectHypothesisWithPose
import cv2
import numpy as np
from cv_bridge import CvBridge
import json


class ObjectDetector(Node):
    def __init__(self):
        super().__init__('object_detector')
        self.declare_parameter('model_path', 'models/yolov8n.pt')
        self.declare_parameter('confidence_threshold', 0.65)
        self.declare_parameter('camera_topic', '/camera/color/image_raw')
        self.declare_parameter('depth_topic', '/camera/depth/image_raw')
        self.declare_parameter('detection_rate_hz', 10.0)

        from ultralytics import YOLO
        self.model = YOLO(self.get_parameter('model_path').value)
        self.conf_threshold = self.get_parameter('confidence_threshold').value
        self.bridge = CvBridge()

        self.image_sub = self.create_subscription(
            Image, self.get_parameter('camera_topic').value, self.on_image, 10
        )
        self.depth_sub = self.create_subscription(
            Image, self.get_parameter('depth_topic').value, self.on_depth, 10
        )

        self.detection_pub = self.create_publisher(
            Detection2DArray, '/capstone/detections', 10
        )
        self.target_pub = self.create_publisher(
            String, '/capstone/detection/target', 10
        )
        self.confidence_pub = self.create_publisher(
            Float32, '/capstone/detection/confidence', 10
        )
        self.status_pub = self.create_publisher(String, '/capstone/detection/status', 10)

        self.latest_depth = None
        self.bridge = CvBridge()

        timer_period = 1.0 / self.get_parameter('detection_rate_hz').value
        self.timer = self.create_timer(timer_period, self.detection_loop)

        self.get_logger().info('Object detector ready')

    def on_depth(self, msg):
        try:
            self.latest_depth = self.bridge.imgmsg_to_cv2(msg, desired_encoding='passthrough')
        except Exception as e:
            self.get_logger().error(f'Depth conversion failed: {e}')

    def on_image(self, msg):
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, 'bgr8')
            self.process_detection(cv_image, msg.header.stamp)
        except Exception as e:
            self.get_logger().error(f'Image conversion failed: {e}')

    def process_detection(self, cv_image, stamp):
        results = self.model(cv_image, verbose=False)
        detections_msg = Detection2DArray()
        detections_msg.header.stamp = stamp
        detections_msg.header.frame_id = 'camera_link'

        best_detection = None
        best_confidence = 0.0

        for result in results:
            boxes = result.boxes
            for box in boxes:
                conf = float(box.conf[0])
                if conf < self.conf_threshold:
                    continue

                cls_id = int(box.cls[0])
                label = self.model.names[cls_id]
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                det = Detection2D()
                det.bbox.center.position.x = (x1 + x2) / 2.0
                det.bbox.center.position.y = (y1 + y2) / 2.0
                det.bbox.size_x = x2 - x1
                det.bbox.size_y = y2 - y1

                hypothesis = ObjectHypothesisWithPose()
                hypothesis.hypothesis.class_id = label
                hypothesis.hypothesis.score = conf
                det.results.append(hypothesis)

                if self.latest_depth is not None:
                    cx, cy = int(det.bbox.center.position.x), int(det.bbox.center.position.y)
                    if 0 <= cy < self.latest_depth.shape[0] and 0 <= cx < self.latest_depth.shape[1]:
                        depth_m = self.latest_depth[cy, cx] / 1000.0
                        if 0.1 < depth_m < 5.0:
                            hypothesis.pose.pose.position.z = depth_m

                detections_msg.detections.append(det)

                if conf > best_confidence:
                    best_confidence = conf
                    best_detection = label

        self.detection_pub.publish(detections_msg)

        if best_detection:
            msg = String()
            msg.data = json.dumps({
                'label': best_detection,
                'confidence': best_confidence,
                'timestamp': stamp.sec,
            })
            self.target_pub.publish(msg)

            conf_msg = Float32()
            conf_msg.data = best_confidence
            self.confidence_pub.publish(conf_msg)

            self.publish_status(f'detected:{best_detection}:{best_confidence:.2f}')
        else:
            self.publish_status('no_target_found')

    def detection_loop(self):
        pass

    def publish_status(self, status):
        msg = String()
        msg.data = status
        self.status_pub.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    node = ObjectDetector()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Tasdeeq aur recovery logic

```python
# verification_node.py
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Float32, Bool
from geometry_msgs.msg import WrenchStamped
import json
import time


class OutcomeVerifier(Node):
    def __init__(self):
        super().__init__('outcome_verifier')
        self.declare_parameter('verification_timeout', 5.0)
        self.declare_parameter('visual_check_enabled', True)
        self.declare_parameter('force_check_enabled', True)
        self.declare_parameter('recovery_strategy', 'retry_then_report')
        self.declare_parameter('max_retries', 2)

        self.verification_sub = self.create_subscription(
            String, '/capstone/planner/plan', self.on_plan_complete, 10
        )
        self.target_sub = self.create_subscription(
            String, '/capstone/detection/target', self.on_target_update, 10
        )
        self.force_sub = self.create_subscription(
            WrenchStamped, '/arm/force_sensor', self.on_force_update, 10
        )
        self.confidence_sub = self.create_subscription(
            Float32, '/capstone/detection/confidence', self.on_confidence_update, 10
        )

        self.result_pub = self.create_publisher(String, '/capstone/verification/result', 10)
        self.recovery_pub = self.create_publisher(String, '/capstone/recovery/action', 10)
        self.status_pub = self.create_publisher(String, '/capstone/verification/status', 10)

        self.current_target = None
        self.current_confidence = 0.0
        self.current_force = 0.0
        self.retry_count = 0

        self.get_logger().info('Outcome verifier ready')

    def on_target_update(self, msg):
        data = json.loads(msg.data)
        self.current_target = data.get('label')
        self.current_confidence = data.get('confidence', 0.0)

    def on_confidence_update(self, msg):
        self.current_confidence = msg.data

    def on_force_update(self, msg):
        self.current_force = msg.wrench.force.z

    def on_plan_complete(self, msg):
        plan = json.loads(msg.data)
        self.verify_outcome(plan)

    def verify_outcome(self, plan):
        self.publish_status('verifying')
        steps = plan.get('steps', [])
        verification_results = []

        for step in steps:
            result = self.check_step(step)
            verification_results.append(result)
            if not result['passed']:
                self.get_logger().warn(f'Step {step.get("step_id")} failed: {result["reason"]}')
                self.trigger_recovery(step, result)

        all_passed = all(r['passed'] for r in verification_results)
        self.publish_final_result(plan, verification_results, all_passed)

    def check_step(self, step):
        action = step.get('action', '')
        success_criteria = step.get('success_criteria', '')

        if action == 'grasp':
            return self.verify_grasp()
        elif action == 'navigate':
            return self.verify_navigation()
        elif action == 'detect':
            return self.verify_detection()
        elif action == 'place':
            return self.verify_placement()
        else:
            return {'passed': True, 'reason': 'no verification needed for this action'}

    def verify_grasp(self):
        if self.get_parameter('force_check_enabled').value:
            if self.current_force < 0.5:
                return {'passed': False, 'reason': 'force too low, grasp may have failed'}
            if self.current_force > 15.0:
                return {'passed': False, 'reason': 'force too high, possible object damage risk'}

        if self.get_parameter('visual_check_enabled').value:
            if self.current_confidence < 0.5:
                return {'passed': False, 'reason': 'object confidence dropped after grasp'}

        return {'passed': True, 'reason': 'grasp verified'}

    def verify_navigation(self):
        return {'passed': True, 'reason': 'navigation result accepted by Nav2'}

    def verify_detection(self):
        if self.current_confidence < self.get_parameter('force_check_enabled').value:
            return {'passed': False, 'reason': 'detection confidence below threshold'}
        return {'passed': True, 'reason': 'detection verified'}

    def verify_placement(self):
        return {'passed': True, 'reason': 'placement verified by position check'}

    def trigger_recovery(self, step, result):
        strategy = self.get_parameter('recovery_strategy').value
        max_retries = self.get_parameter('max_retries').value

        if strategy == 'retry_then_report':
            if self.retry_count < max_retries:
                self.retry_count += 1
                self.get_logger().warn(f'Recovery: retry {self.retry_count}/{max_retries}')
                msg = String()
                msg.data = json.dumps({
                    'action': 'retry',
                    'step_id': step.get('step_id'),
                    'attempt': self.retry_count,
                    'reason': result['reason'],
                })
                self.recovery_pub.publish(msg)
            else:
                self.get_logger().error(f'Recovery: max retries reached for step {step.get("step_id")}')
                msg = String()
                msg.data = json.dumps({
                    'action': 'report_failure',
                    'step_id': step.get('step_id'),
                    'reason': result['reason'],
                })
                self.recovery_pub.publish(msg)
                self.retry_count = 0

    def publish_final_result(self, plan, results, all_passed):
        msg = String()
        msg.data = json.dumps({
            'plan_valid': True,
            'all_steps_passed': all_passed,
            'results': results,
            'total_steps': len(results),
            'passed_steps': sum(1 for r in results if r['passed']),
            'timestamp': self.get_clock().now().nanoseconds,
        })
        self.result_pub.publish(msg)
        self.publish_status('passed' if all_passed else 'failed')

    def publish_status(self, status):
        msg = String()
        msg.data = status
        self.status_pub.publish(msg)


def main(args=None):
    rclpy.init(args=args)
    node = OutcomeVerifier()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Gehrai se mutalay ke mawzuat

### System architecture: tamam saat parrhatein

<div className="visual-panel">
<h3>Mukammal capstone parrhatein ka naqsha</h3>
<div className="textbook-grid">
<div className="textbook-card"><h3>Parrhat 1: Audio Input</h3><p>ReSpeaker microphone array ya simulated audio topic se kham audio qabz. Voice activity detection ke liye WebRTC VAD. Transcription ke liye Whisper. Shor, khamoshi aur phrase timeout ko sambhalta hai.</p></div>
<div className="textbook-card"><h3>Parrhat 2: Intent Parsing</h3><p>Transcript amal ki qism, hadaf object, hadaf muqam, itminani ki zarooriyat aur pabandiyon ke fields ke saath hadaf shuda neyat JSON ban jata hai. Schema tasdeeq ghair durust ya namukammal neyaton ko mustarad karta hai.</p></div>
<div className="textbook-card"><h3>Parrhat 3: Task Planning</h3><p>LLM neyat ko bund tarteeb walay qadmon mein taqseem karta hai. Har qadam ke paas amal ki qism, hadaf, parameters, timeout aur kamyabi ke mayar hote hain. Mansooba tasdeeq zyada se zyada qadmon, ijaazat yafta action whitelist aur timeout ki hadood ko nafiz karta hai.</p></div>
<div className="textbook-card"><h3>Parrhat 4: Navigation</h3><p>ROS 2 Nav2 action client navigation server ko goals bhejta hai. Costmap, rukawat se bachao, dobara mansooba bandi aur timeout ko sambhalta hai. Feedback aur natijey ki halat report karta hai.</p></div>
<div className="textbook-card"><h3>Parrhat 5: Perception</h3><p>YOLO ya RT-DETR object detection ke liye camera ki tasaveer process karta hai. Depth camera 3D position faraham karta hai. Itminan had filtering kamzor shanakhton ko filter karta hai. Target publisher behtareen match ko planner ko bhejta hai.</p></div>
<div className="textbook-card"><h3>Parrhat 6: Manipulation</h3><p>Arm controller rasai aur grasp goals swaal karta hai. Gripper force-mahdood grasp lagata hai. Force sensor rabtay ki nigrani karta hai. Trajectory planner workspace ki hadood ke andar collision-free motion yakinī banata hai.</p></div>
<div className="textbook-card"><h3>Parrhat 7: Verification</h3><p>Natije ki halat ko mansooba ki tawakkaat ke khilaf check karta hai. Visual tasdeeq object position ki tasdeeq karti hai. Force tasdeeq grasp kamyabi ki tasdeeq karti hai. Recovery node dobara koshish ya failure report trigger karta hai.</p></div>
</div>
</div>

### Module ke darmiyan data flow

Har module ROS 2 topics, services ya actions ke zariye baat cheet karta hai. Data flow ek directed acyclic graph ki pairwai karta hai jis mein ek feedback loop hai:

| Source | Message type | Manzil | Mawad |
|---|---|---|---|
| Awaz node | `std_msgs/String` | Planner node | Kham transcript text |
| Planner node | `std_msgs/String` | Navigation node, Manipulation node | Tarteeb walon ke saath JSON mansooba |
| Planner node | `std_msgs/String` | Verification node | Natijey ki checking ke liye mukammal mansooba |
| Camera | `sensor_msgs/Image` | Detection node | RGB aur depth frames |
| Detection node | `vision_msgs/Detection2DArray` | Planner node, Verification node | Object labels, itminan, bounding boxes |
| Detection node | `std_msgs/Float32` | Verification node | Behtareen detection itminan |
| Nav2 server | `nav2_msgs/action/NavigateToPose` | Navigation client | Goal, feedback, natija |
| Arm controller | `trajectory_msgs/JointTrajectory` | Manipulation node | Rasai aur grasp ke liye joint positions |
| Force sensor | `geometry_msgs/WrenchStamped` | Verification node | Grasp ke dauran rabtay ka force |
| Verification node | `std_msgs/String` | Orchestrator node | Wajuhaat ke saath pass/fail natija |
| Recovery node | `std_msgs/String` | Muasser node | Dobara koshish ka hukm ya failure report |
| Orchestrator | `std_msgs/String` | Tamam nodes | Demo instrumentation ke liye halat topic |

### Har parrhat par kharabi ka intizam

| Parrhat | Aam kharabiyan | Shanakht ka tareeqa | Recovery amal |
|---|---|---|---|
| Audio | Pusht ka shor, khamoshi, awaz kati hui | Energy had, phrase timeout | Sarif se dohrane ko kahen, timeout barhayein |
| Intent parsing | Ghair wazeh hukm, fields ghair | Schema tasdeeq, zaroori field check | Sarif se wazahat ki darkhwast |
| Planning | Namuna actions, zyade qadam, namaloom object | Mansooba tasdeeq ke qawaid | Mansooba mustarad, muntakhab tajweez |
| Navigation | Rasta masdood, maqamiyat nakaam, timeout | Nav2 natijey ki halat, costmap alerts | Dobara mansooba bandi, recovery behavior par switch |
| Perception | Kam itminan, maskani, ghalat object | Itminan had, depth tasdeeq | Dobara scan, sarif se nayi position ki darkhwast |
| Manipulation | Naqabil rasai object, zyada force, phisalna | Workspace hadood check, force hadood | Mansookh, mahdoodiyat report |
| Verification | Natije mein na-munaasibat, namukammal mukammal hona | Visual aur force check | Dobara koshish, khushgawar kami, report |

### Demo instrumentation aur logging

Ek peshawara demo har lamhe dikhata hai ke robot kya sochta hai. Instrumentation ikhtiyari nahi hai. Judges sirf satah se motion se integration ke mayar ka jaiza nahi le sakte.

**Kya dikhayen ya log karein:**

- Transcribed hukm text aur itminan
- Tashreeh shuda neyat JSON
- Tayyar shuda mansooba qadam halat isharon ke saath
- Navigation goal, maujooda position, aur goal se faasla
- Shanakht shuda objects labels, itminan, aur 3D positions ke saath
- Grasp ki koshishein force readings ke saath
- Tasdeeqi nataij har qadam par pass/fail ke saath
- Uthaye gaye recovery amal aur un ke nataij
- Kul amali waqt aur f qadam timing

**Laagu ka namoona:**

```python
# instrumentation_pattern.py
import json
import time
from std_msgs.msg import String


class DemoInstrumentor:
    def __init__(self, node):
        self.node = node
        self.status_pub = node.create_publisher(String, '/capstone/status', 10)
        self.start_time = None
        self.step_times = {}

    def log_event(self, event_type, data):
        entry = {
            'type': event_type,
            'data': data,
            'timestamp': self.node.get_clock().now().nanoseconds,
            'elapsed_s': time.time() - self.start_time if self.start_time else 0,
        }
        self.node.get_logger().info(f'DEMO_EVENT: {json.dumps(entry)}')
        msg = String()
        msg.data = json.dumps(entry)
        self.status_pub.publish(msg)

    def start_timing(self, step_name):
        self.step_times[step_name] = time.time()

    def end_timing(self, step_name):
        if step_name in self.step_times:
            duration = time.time() - self.step_times.pop(step_name)
            self.log_event('timing', {'step': step_name, 'duration_s': duration})
            return duration
        return 0.0
```

### Evaluation rubric scoring mayar ke saath

| Mayar | Wazn | Behtareen (5) | Achha (3-4) | Munasib (1-2) | Ghair (0) |
|---|---|---|---|---|---|
| Task grounding | 20% | Hukm hadaf shuda, janchne, tasdeeq shuda ahdaaf pabandiyon ke saath ban jata hai | Ahdaaf hadaf shuda lekin tasdeeq ghair | Ahdaaf ghair hadaf shuda text | Koi goal tashreeh nahi |
| Hifazat | 20% | Tamam namuna halatein robot ko rokti hain, har parrhat par pabandiyon ko nafiz | Zyada tar pabandiyon ko nafiz, ek khaali | Kuch hifazati check, ahem khaali | Koi hifazati check nahi |
| Navigation | 15% | Robot rukawaton se bachta hai, tarakki report karta hai, dobara mansooba bandi sambhalta hai | Chhote masail ke saath kamyabi se navigate | Rukawaton ya takheer ke saath goal tak pahunchta | Koi navigation nahi |
| Perception | 15% | Itminan, depth aur tasdeeq ke saath object detection | Detection kaam karta lekin itminan check nahi | Detection ghair mustaqil | Koi idrak nahi |
| Recovery | 15% | Khudkar recovery ke saath kam az kam do failure raste sambhalta hai | Ek failure raste sambhalta hai | Failure ki shanakht lekin recovery nahi | Koi failure handling nahi |
| Wazahat | 15% | System har qadam par kya hua aur kyun hua zahir karta hai | Zyada tar halat maloomat dikhata hai | Sirf aakhri natija dikhata | Koi numaya nahi |

### Iztirari ahdaaf

**RAG par mabni course book Q&A:**
Ek retrieval-augmented generation system ko integrate karein jo farhangarton ke har capstone subsystem ke baray mein seekhne walon ke sawalon ka jawab de. Course book ke babon ko vector database (ChromaDB ya Qdrant) mein index karein. Jab seekhne wala puchta hai "planner namuna hukmon ko kyun mustarad karta hai," to mansooba bandi aur hifazat ke babon se mutaliqa paragraph haasil karein aur hadaf shuda jawab banayein.

**Sarif zati sazi:**
Sarif ki pasmand ke bunyad par demo ki pechidgi adapt karein. Software sirf seekhne wale ko ROS 2 tasawwuraat ki zyada wazahat dekhta hai. Hardware seekhne wale ko sensor calibration aur actuator hadood ke baray mein mazeed tafseelaat dekhta hai. Tarjihat mehfooz karein aur demo ki tafseel aur istilahat ko adjust karein.

**Urdu tarjuma:**
Capstone chapter ke mohtaw ko wase tartar qabiliyat ke liye Urdu mein tarjuma karein. Takniki istilahat ke mehfooz rakhne ke saath hadaf shuda tarjuma istemal karein. ROS 2, Nav2 aur YOLO jaisi kalidi istilahat English mein rehti hain. Tasawwuri wazahat munasib takniki register ke saath tarjuma ki jati hain.

**Narration demo script:**
Capstone demo ka 90 second narration walkthrough record karein. Narration har parrhat ko chalte hue wazahat karta hai, tradeoffs aur design faislon ki nishandahi karta hai. Hackathon jama karane aur baid se jaiza lene ke liye mufeed hai.

**Kasir zubani soti madad:**
Awaz node ko Urdu, English aur code-switched hukmon ko sambhalne ke liye barhayein. Is ke liye kasir zubani Whisper model aur zuban ki milan sambhalne wali neyat ki tashreeh zaroori hai.

## Mukammal capstone laagu guide

### Marhala 1: Mahol ki tartib (Din 1-2)

1. Ubuntu 22.04 par ROS 2 Humble install karein.
2. Humanoid robot model (Unitree G1 URDF ya hasb-e-zaroorat) ke saath Gazebo Fortress install karein.
3. Nav2 install karein aur apne mahol ke liye navigation stack configure karein.
4. Catkin workspace banayein aur `capstone_humanoid` package shuru karein.
5. Tasdeeq karein ke robot model sensor plugins (camera, depth, LiDAR, IMU) ke saath Gazebo mein load hota hai.
6. Buniyadi teleoperation test karein taake joint controllers aur base motion kaam kar rahe hon.

### Marhala 2: Awaz aur mansooba bandi (Din 3-4)

1. Whisper aur WebRTC VAD ke saath awaz node laagu karein.
2. Mukhtalif shor ki sharait mein kam az kam 10 mukhtalif hukmon ke saath transcription test karein.
3. LLM integration ke saath planner node laagu karein.
4. Mansooba bandi ka prompt template bayan karein aur kam az kam 20 hukmon ke saath test karein.
5. Mansooba tasdeeq aur namuna hukmon ko mustarad karna laagu karein.
6. Tasdeeq karein ke mukammal audio se mansooba tak workflow 5 second se kam mein chalta hai.

### Marhala 3: Navigation integration (Din 5-6)

1. Demo mahol ke liye Nav2 ko costmap, planner aur controller ke saath configure karein.
2. Timeout aur feedback ke saath navigation action client laagu karein.
3. Kam az kam 5 hadaf maqamat par navigation test karein.
4. Rukawat ke manzar shamil karein aur dobara mansooba bandi ka amal dekhein.
5. Masdood raston aur timeouts ke liye recovery behavior laagu karein.
6. Logging aur timing ke saath navigation ko instrument karein.

### Marhala 4: Idrak aur handling (Din 7-8)

1. Capstone objects ke liye object detection model train ya fine-tune karein.
2. Itminan had ke saath detection node laagu karein.
3. 3D object position andaze ke liye depth camera ko integrate karein.
4. Rasai aur grasp tartibon ke saath handling node laagu karein.
5. Force monitoring aur workspace hadood check shamil karein.
6. Simulation mein mukammal detect-grasp-place workflow test karein.

### Marhala 5: Integration aur tasdeeq (Din 9-10)

1. Orchestrator node laagu karein jo tamam subsystems ko tartib deta hai.
2. Tamam parrhateen ko tasdeeq aur recovery logic se jorein.
3. Kam az kam 10 mukhtalif soti hukmon ke saath aakhir se aakhir test chalayein.
4. Demo logging ke saath mukammal workflow ko instrument karein.
5. Tamam failure modes aur recovery behavior ki shanakht karein aur dastawiz karein.
6. Demo ki mashq karein jab tak ke yeh 5 minute se kam mein qabil-e-etmad tareeqe se na chale.

### Marhala 6: Tazyeen aur jama karana (Din 11-13)

1. Narration ke saath demo video record karein.
2. Hackathon jama karane ka dastawiz likhein.
3. Tartib ki hadayat ke saath mansooba ki README banayein.
4. Aik safeena design brief tayyar karein.
5. Judges ke mumkina hukmon ke saath aakhri integration test chalayein.
6. Deadline se pehle jama karayein.

## Hackathon jama karane ka checklist

- [ ] Demo video record (2-5 minute) har parrhat ki wazahat ke saath narration
- [ ] Mansooba ka unwaan, team ke murghian, wazahat, tartib ki hadayat ke saath README
- [ ] Design brief: hukm, mahol, salahiyaton, ROS 2 nodes, hifazati check ka aik safeena
- [ ] Waze sakht aur build hadayat ke saath source code repository
- [ ] Aik hukm se mukammal system shuru karne wala launch file
- [ ] Mukhtalif soti hukmon ke saath kam az kam 3 kamyab aakhir se aakhir numaison
- [ ] Kam az kam 1 numaish shuda failure recovery rasta
- [ ] Har qadam par robot ki halat dikhane wala demo instrumentation
- [ ] Hifazati dastawiz: pabandiyat, hadood, hangami rukawat ka amal
- [ ] Hardware transfer plan (agar laagu ho): fizik robot ke liye kya badalna hai
- [ ] Mansoobay mein istemal shuda takniki istilahat ki fehrist
- [ ] Jama karane ka form deadline se pehle mukammal

## Amali lab

<div className="lab-box">
<h3>Lab: apna capstone design brief likhein</h3>
<p>Apne capstone ke liye aik safeena design brief likhein. Mandarja zail hissay shamil karein:</p>
<ol>
<li><strong>Sarif ka hukm</strong>: Woh makhsoos soti hukm jo aap ka robot sambhalta hai.</li>
<li><strong>Mahol ki tartib</strong>: Kamre ki layout, rukawatein, hadaf objects aur un ki positions.</li>
<li><strong>Robot ki salahiyatein</strong>: Robot kya kar sakta hai aur kya nahi.</li>
<li><strong>ROS 2 nodes</strong>: Har node, us ka topic/service/action, aur us ka input/output fehrist banayein.</li>
<li><strong>Idrak ke ajza</strong>: Camera model, detection model, itminan hadood.</li>
<li><strong>Hifazati check</strong>: Raftaar ki hadood, force ki hadood, workspace ki hadood, hangami rukawat.</li>
<li><strong>Failure modes</strong>: Kam az kam 3 failure manzar recovery behavior ke saath.</li>
<li><strong>Kamyabi ke mayar</strong>: Aap kaise jante hain ke demo kamyab raha.</li>
<li><strong>Demo script</strong>: 90 second presentation ke liye qadam ba qadam narration.</li>
</ol>
</div>

## Quiz

### Apni samajh check karein

1. Hardware ki nasb se pehle capstone simulation mein kyun shuru hona chahiye?
2. Kya LLM janaura mansooba robot par laagu karne ke liye kafi mehfooz banata hai?
3. Jab idrak ka itminan kam ho to demo ko kya dikhana chahiye?
4. Natij ki tasdeeq robot workflow ka hissa kyun hai aur ikhtiyari kyun nahi?
5. Capstone architecture ki saat parrhatein aur har ek ki zimmedari ka naam batayein.
6. Mansooba tasdeeq ka maqsad kya hai, aur yeh kaun se qawaid nafiz karta hai?
7. Navigation node timeout hone wale goal ko kaise sambhalta hai?
8. Grasp workflow ko visual tasdeeq ke ilawa force readings kyun check karni chahiye?
9. Demo instrumentation parrhat ka maqsad kya hai?
10. Aik recovery behavior ki wazahat karein jo verification node trigger kar sakta hai.

### Jawabat ki kunji

1. Simulation fizik khatre ke baghair integration test ki ijaazat deta hai. Yeh kisi ko chot na pahunchne ya hardware ko nuqsan na pahunchne se pehle software ki bugs, timing ke masail aur logic kharabiyan zahir karta hai.
2. Mansooba bund (zyada se zyada qadam), tasdeeq shuda (action whitelist), controller-mahfooz actions mein tarjuma shuda, aur timeout aur feedback ke saath monitor hona chahiye. Namuna ya ghair wazeh mansoobon ko mustarad kiya jana chahiye.
3. Aik mehfooz rukawat, wazahat ki darkhwast, dobara scan, ya mutabadil recovery rasta. Demo ko kam itminan ko chhupane ki bajaye judges ko numaya dikhana chahiye.
4. Robot ko yeh janna zaroori hai ke kya amal ne matloob halat haasil ki ya recovery ki zaroorat hai. Tasdeeq ke baghair, namiyatein khushkushi se workflow mein phailti hain.
5. (1) Audio Input: soti qabz aur transcription. (2) Intent Parsing: text ko hadaf shuda goal mein tabdeel. (3) Task Planning: LLM bund qadmon mein taqseem. (4) Navigation: mahol mein mehfooz tareeqe se harkat. (5) Perception: objects ki shanakht aur maqamiyat. (6) Manipulation: rasai, grasp aur rakhna amali taur par. (7) Verification: natij ki tasdeeq aur recovery trigger.
6. Mansooba tasdeeq zyada se zyada qadam ginti, ijaazat yafta action whitelist, timeout ki hadood aur zaroori fields nafiz karti hai. Yeh namuna, bohot pechida ya namukammal mansoobon ko mustarad karti hai.
7. Navigation node goal mansookh karta hai, timeout waqiya log karta hai, dobara mansooba bandi ka counter barhata hai, aur ya to recovery rasta azmata hai ya navigation nakami ki report orchestrator ko bhejta hai.
8. Sirf visual tasdeeq kamyab grasp ki tasdeeq nahi kar sakti. Object numaya ho sakta hai lekin phisal raha ho, ya gripper band ho sakta hai baghair rabtay ke. Force readings fizik rabtah aur grip ki istehkam ki tasdeeq karti hain.
9. Instrumentation parrhat har lamhe robot kya sochta hai, kya faisla karta hai aur kya karta hai is ko log karta hai. Yeh judges aur developers ko sirf satah se motion nahi balke engineering ke mayar ko dekhne ke qabil banata hai.
10. Mumkin recovery actions mein shamil hain: adjusted parameters ke saath nakam qadam dobara azmayen, baqi qadmon ki dobara mansooba bandi, sarif se wazahat ki darkhwast, ya nakami report karein aur khushgawar tareeqe se ruk jayen.

## Fehrist-e-Alfaaz

- **Capstone**: Aik mutalqa mansooba jo tamam course modules ko aik kaam khudkar system mein jodta hai.
- **VLA (Vision-Language-Action)**: Buniyadi idrak, qudrati zan ki samajh aur robot ke amal ko jodne wala workflow namoona.
- **Task Decomposition**: Oonchi satah ke goal ko tarteeb wali, bund, amali tasks mein taqseem karne ka amal.
- **Plan Validator**: Hifazati parrhat jo laagu karne se pehle LLM janaura mansoobon ko pabandiyon ke khilaf check karti hai.
- **Action Whitelist**: Robot actions ki fehrist jo planner ko istemal ki ijaazat hai, gair ijazat hukmon ko rokti hai.
- **Recovery Behavior**: Nakamiyon ke khudkar jawabat, shamil dobara mansooba bandi, dobara koshish, madad ki darkhwast, ya ruk jana.
- **Demo Instrumentation**: Jaiza lene aur debug karne ke liye robot ki halat, faislon aur nataij ka logging aur display.
- **Outcome Verification**: Yeh check karne ka amal ke kya amali taur par kiye gaye amal ne un ke matloob asraat haasil kiye.
- **Force Monitoring**: Grasp ke dauran fizik rabte ki tasdeeq ke liye force/torque sensor data ka istemal.
- **Confidence Threshold**: Robot ke kisi object par amal karne se pehle zaroori minimum detection score.
- **Nav2**: ROS 2 navigation stack jo rasta mansooba bandi, rukawat se bachao aur recovery behavior faraham karta hai.
- **Simulation-First**: Yeh usool ke hardware ki nasb se pehle tamam integration test simulation mein honi chahiye.
- **Grounding**: Zaban ke hawalon (jaise "red cup") ko sensors se shanakht shuda fizik objects se jorna.
- **Action Client**: ROS 2 namoona jo action server ko goals bhejta hai aur feedback aur nataij ki nigrani karta hai.
- **Digital Twin**: Robot aur mahol ka simulation version jo mehfooz testing aur tasdeeq ke liye istemal hota hai.
- **Replan**: Naya navigation rasta banane ka amal jab maujooda rasta masdood ho ya nakaam ho.
- **Emergency Stop**: Hifazat-tanzeem halaat se trigger hone wala tamam robot harkat ka fori rukawat.
- **Workspace Bounds**: Fazai hadood jin ke andar robot arm mehfooz tareeqe se rasai aur handling kar sakta hai.
- **Orchestrator**: Markazi node jo tamam subsystems ko tartib deta hai aur majmooi demo ke bahao ka intizam karta hai.
- **Design Brief**: Capstone ke hukm, mahol, salahiyaton aur kamyabi ke mayar ki wazahat karne wala aik safeena dastawiz.
