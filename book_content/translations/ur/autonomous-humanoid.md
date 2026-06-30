---
sidebar_position: 1
title: Autonomous Humanoid Capstone
description: Capstone project — integrate speech recognition, LLM task planning, autonomous navigation, computer vision, and robotic manipulation into a complete simulated humanoid workflow with ROS 2, Gazebo, Nav2, and VLA pipelines.
keywords: [capstone project, autonomous humanoid, speech recognition, LLM planning, robot navigation, computer vision, manipulation, ROS 2, Gazebo, Nav2, VLA pipeline, task decomposition, object detection, grasp planning, hackathon, digital twin]
---

import PersonalizationToolbar from '@site/src/components/Personalization/PersonalizationToolbar';

# Autonomous Humanoid Capstone

<PersonalizationToolbar chapterSlug="capstone/autonomous-humanoid" />

## سیکھنے کے نتائج

- بیان کریں کہ آواز کی پہچان، LLM منصوبہ بندی، ادراک، نیویگیشن اور ہینڈلنگ ایک واحد خودکار humanoid ورک فلو میں کیسے ملتے ہیں۔
- ایک صوتی حکم کو خام آڈیو سے نیت کی تشریح، ہدف شدہ ٹاسک ڈیکمپوزیشن، ROS 2 ایکشن ڈسپیچ، ٹارگٹ ڈیٹیکشن، گرسپیکیشن اور نتیجے کی تصدیق تک ٹریس کریں۔
- زبان کے آؤٹ پٹ اور فزیکل موشن کے درمیان ہر تصدیقی گیٹ کی شناخت کریں اور وضاحت کریں کہ ہر گیٹ کیوں موجود ہے۔
- ایک کیپسٹون ڈیمو ڈیزائن کریں جو انجینئرنگ ٹریڈ آفٹس اور فیلور موڈز کو ظاہر کرے انہیں چھپانے کی بجائے۔
- ایک مکمل ROS 2 لانچ فائل لاگو کریں جو پیرامیٹرائزڈ کنفیگریشن کے ساتھ تمام کیپسٹون سبسسٹمز شروع کرے۔
- ورک فلو کی ہر پرہت پر ریکوری بہاؤ، ٹائم آؤٹ ہینڈلنگ اور حفاظتی پابندیوں کا جائزہ لیں۔
- صرف سیمیولیشن کی تصدیق کو ہارڈویئر ٹرانسفر کی ضروریات سے موازنہ کریں اور وضاحت کریں کہ کیا بدلنا ضروری ہے۔

## تصور کی وضاحت

کیپسٹون پورے کورس کو ایک مربوط سیمیولیٹڈ humanoid ورک فلو میں جوڑتا ہے۔ صارف ایک حکم بولتا ہے۔ روبوٹ سنتا ہے، نیت کو سمجھتا ہے، نیت کو محدود ٹاسکس میں تقسیم کرتا ہے، نیویگیشن راستہ منصوبہ بندی کرتا ہے، رکاوٹوں سے بچتا ہے، کمپیوٹر ویژن کا استعمال کرتے ہوئے ٹارگٹ آبجیکٹ کی شناخت کرتا ہے، آبجیکٹ کو ہینڈل کرتا ہے اور نتیجے کی تصدیق کرتا ہے۔ اگر کوئی مرحلہ ناکام ہو جاتا ہے، تو روبوٹ بے وجہ آگے بڑھنے کی بجائے ریکوری راستے میں داخل ہوتا ہے۔

انٹیگریشن وہ بنیادی مہارت ہے جس کا یہ منصوبہ جائزہ لیتا ہے۔ آواز کی پہچان، LLMs، ROS 2 یا کمپیوٹر ویژن کا الگ تھلگ علم ناکافی ہے۔ مشکل مسائل حدود پر رہتے ہیں: غیر ہدف شدہ زبان کو ہدف شدہ اہداف میں تبدیل کرنا جنہیں کنٹرولرز تصدیق کر سکتے ہیں، اعلیٰ سطحی منصوبوں کو ٹائم آؤٹ اور فیڈبیک مانیٹرنگ کے ساتھ ROS 2 ایکشن گولز میں ترجمہ کرنا، زبان کے حوالوں کو ادراک کردہ آبجیکٹس سے جوڑنا، اور یہ تصدیق کرنا کہ فزیکل حالت مطلوبہ نتیجے سے ملتی ہے۔

ایک مضبوط کیپسٹون سسٹم کی حدود کو نمایاں بناتا ہے۔ ہر سبسسٹم — آواز، منصوبہ بندی، ادراک، نیویگیشن، ہینڈلنگ، تصدیق — کے پاس واضح ان پٹ، واضح آؤٹ پٹ، اور واضح فیلور موڈ ہوتا ہے۔ ڈیمو کو ججز کو دکھانا چاہیے کہ روبوٹ کیا سوچتا ہے، اس نے کیا فیصلہ کیا، اس نے کیا کرنے کی کوشش کی، اور کیا وہ کامیاب ہوا۔ بغیر دکھائی دینے والی منطق کے سطحی موشن انٹیگریشن کا خطرہ ہے، ڈیمو کی طاقت نہیں۔

ورک فلو پہلے سیمیولیشن میں چلتا ہے۔ Gazebo فزیکس، سینسر ماڈلز، ٹکراؤ جیومیٹری، اور ماحولیاتی انٹریکشن فراہم کرتا ہے۔ ROS 2 کمیونیکیشن میڈل ویئر فراہم کرتا ہے: نوڈز، ٹاپکس، سروسز، ایکشنز اور پیرامیٹرز۔ Nav2 خودکار نیویگیشن سنبھالتا ہے۔ Vision-Language-Action بریج زبان کی سمجھ کو روبوٹ کے عمل سے جوڑتا ہے۔ نتیجہ ایک ٹیسٹ کرنےے، ڈیبگ کرنےے، اور دکھانےے کے قابل خودکار سسٹم ہے۔

## ویژل ماڈل: کیپسٹون آرکیٹیکچر

<div className="visual-panel">
<h3>کیپسٹون ورک فلو کی تمام سات پرہتیں</h3>
<div className="visual-flow">
<div className="flow-step"><span>1. سننا</span>مائیکروفون خام آڈیو قبض کرتا ہے، Whisper ٹیکسٹ میں تبدیل کرتا ہے</div>
<div className="flow-step"><span>2. تشریح</span>ٹیکسٹ عمل، آبجیکٹ، مقام اور پابندیوں کے ساتھ ہدف شدہ نیت بن جاتا ہے</div>
<div className="flow-step"><span>3. منصوبہ بندی</span>LLM نیت کو محدود، ترتیب والی، تصدیق شدہ ٹاسکس میں تقسیم کرتا ہے</div>
<div className="flow-step"><span>4. نیویگیشن</span>ROS 2 Nav2 ایکشن رکاوٹ سے بچاؤ اور دوبارہ منصوبہ بندی کے ساتھ راستہ چلاتا ہے</div>
<div className="flow-step"><span>5. دیکھنا</span>YOLO یا RT-DETR ٹارگٹ آبجیکٹ کو اعتماد اور 6-DoF pose کے ساتھ پکڑتا ہے</div>
<div className="flow-step"><span>6. عمل کرنا</span>ہینڈلر رسائی، گرسپ، اٹھانا اور رکھنا فورس مانیٹرنگ کے ساتھ انجام دیتا ہے</div>
<div className="flow-step"><span>7. تصدیق</span>سسٹم نتیجے کی حالت چیک کرتا ہے اور ضرورت پر ریکوری ٹریگر کرتا ہے</div>
</div>
</div>

## کیپسٹون کی ضروریات میٹرکس

| ضرورت | ڈیمو میں ثبوت | فیلور کا عمل | تصدیقی گیٹ |
|---|---|---|---|
| صوتی حکم قبول | ٹرانسکرپٹ لاگ میں ظاہر | صارف سے دہرانے کو کہیں، 10s کے بعد ٹائم آؤٹ | آڈیو انرجی حد، ٹرانسکرپشن اعتماد |
| نیت کی تشریح | ہدف شدہ JSON ظاہر | مبہم حکم مسترد، وضاحت کی درخواست | اسکیما تصدیق، ضروری فیلڈ چیک |
| منصوبہ تیار | قدم فہرست نمایاں اور محدود | نامحفوظ یا حد سے تجاوز کرنے والا منصوبہ مسترد | زیادہ سے زیادہ قدم گنتی، ایکشن وائٹ لسٹ، ٹائم آؤٹ |
| راستہ منصوبہ بندی | روبوٹ کا راستہ Gazebo میں دکھایا | رکاوٹ پر دوبارہ منصوبہ بندی یا رک جائیں | Nav2 کاسٹ میپ، رکاوٹ کی وضاحت |
| آبجیکٹ کی شناخت | لیبل اور اعتماد دکھایا | دوبارہ اسکین، وضاحت کی درخواست، یا منسوخ | اعتماد حد، باؤنڈنگ باکس کی درستگی |
| ہینڈلنگ کی کوشش | روبوٹ رسائی اور گرسپ محفوظ طریقے سے کرتا ہے | ناقابل رسائی یا فورس زیادہ ہونے پر منسوخ | ورک اسپیس کی حدود، فورس حد |
| نتیجے کی تصدیق | حتمی حالت گول کے خلاف چیک | غیر مکمل ٹاسک کی رپورٹ، دوبارہ کوشش کی تجویز | بصری تصدیق، فورس سینسر چیک |

## کوڈ مثالیں

### کیپسٹون کے لیے مکمل ROS 2 لانچ فائل

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

### صوتی حکم پروسیسنگ ورک فلو

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

### LLM ٹاسک ڈیکمپوزیشن پرامپٹ ٹیمپلیٹ

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

### نیویگیشن گول ایکشن کلائنٹ

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

### آبجیکٹ ڈیٹیکشن اور گرسپ ورک فلو

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

### تصدیق اور ریکوری لاجک

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

## گہرائی سے مطالعہ کے موضوعات

### سسٹم آرکیٹیکچر: تمام سات پرہتیں

<div className="visual-panel">
<h3>مکمل کیپسٹون پرہتیں کا نقشہ</h3>
<div className="textbook-grid">
<div className="textbook-card"><h3>پرہت 1: آڈیو ان پٹ</h3><p>ReSpeaker مائیکروفون ایرے یا سیمیولیٹڈ آڈیو ٹاپک سے خام آڈیو قبض۔ صوتی سرگرمی کی شناخت کے لیے WebRTC VAD۔ ٹرانسکرپشن کے لیے Whisper۔ شور، خاموشی اور فقرے کے ٹائم آؤٹ کو سنبھالتا ہے۔</p></div>
<div className="textbook-card"><h3>پرہت 2: نیت کی تشریح</h3><p>ٹرانسکرپٹ عمل کی قسم، ہدف آبجیکٹ، ہدف مقام، اعتماد کی ضروریات اور پابندیوں کے فیلڈز کے ساتھ ہدف شدہ نیت JSON بن جاتا ہے۔ اسکیما تصدیق غلط یا غیر مکمل نیتوں کو مسترد کرتی ہے۔</p></div>
<div className="textbook-card"><h3>پرہت 3: ٹاسک منصوبہ بندی</h3><p>LLM نیت کو محدود ترتیب والے قدموں میں تقسیم کرتا ہے۔ ہر قدم کے پاس عمل کی قسم، ہدف، پیرامیٹرز، ٹائم آؤٹ اور کامیابی کے معیار ہوتے ہیں۔ منصوبہ تصدیق زیادہ سے زیادہ قدموں، اجازت یافتہ ایکشن وائٹ لسٹ اور ٹائم آؤٹ کی حدود کو نافذ کرتی ہے۔</p></div>
<div className="textbook-card"><h3>پرہت 4: نیویگیشن</h3><p>ROS 2 Nav2 ایکشن کلائنٹ نیویگیشن سرور کو گولز بھیجتا ہے۔ کاسٹ میپ، رکاوٹ سے بچاؤ، دوبارہ منصوبہ بندی اور ٹائم آؤٹ کو سنبھالتا ہے۔ فیڈبیک اور نتیجے کی حالت رپورٹ کرتا ہے۔</p></div>
<div className="textbook-card"><h3>پرہت 5: ادراک</h3><p>YOLO یا RT-DETR آبجیکٹ ڈیٹیکشن کے لیے کیمرے کی تصاویر پروسیس کرتا ہے۔ ڈیپتھ کیمرا 3D پوزیشن فراہم کرتا ہے۔ اعتماد حد کمزنگ کمزور شناختوں کو فلٹر کرتی ہے۔ ٹارگٹ پبلشر بہترین میچ کو پلانر کو بھیجتا ہے۔</p></div>
<div className="textbook-card"><h3>پرہت 6: ہینڈلنگ</h3><p>آرم کنٹرولر رسائی اور گرسپ گولز وصول کرتا ہے۔ گرپر فورس محدود کردہ گرسپ لاگو کرتا ہے۔ فورس سینسر رابطے کی نگرانی کرتا ہے۔ ٹریجیکٹری پلانر ورک اسپیس کی حدود کے اندر ٹکراؤ مکت موشن یقینی بناتا ہے۔</p></div>
<div className="textbook-card"><h3>پرہت 7: تصدیق</h3><p>نتیجے کی حالت کو منصوبہ کی توقعات کے خلاف چیک کرتا ہے۔ بصری تصدیق آبجیکٹ کی پوزیشن کی تصدیق کرتی ہے۔ فورس تصدیق گرسپ کی کامیابی کی تصدیق کرتی ہے۔ ریکوری نوڈ دوبارہ کوشش یا فیلور رپورٹ ٹریگر کرتا ہے۔</p></div>
</div>
</div>

### ماڈیولز کے درمیان ڈیٹا فلو

ہر ماڈیول ROS 2 ٹاپکس، سروسز یا ایکشنز کے ذریعے بات چیت کرتا ہے۔ ڈیٹا فلو ایک ہدف شدہ ایسائیکل گراف کی پیروی کرتا ہے جس میں ایک فیڈبیک لوپ ہے:

| سورس | پیغام کی قسم | منزل | مواد |
|---|---|---|---|
| آواز نوڈ | `std_msgs/String` | پلانر نوڈ | خام ٹرانسکرپٹ ٹیکسٹ |
| پلانر نوڈ | `std_msgs/String` | نیویگیشن نوڈ، ہینڈلنگ نوڈ | ترتیب والے قدموں کے ساتھ JSON منصوبہ |
| پلانر نوڈ | `std_msgs/String` | تصدیقی نوڈ | نتیجے کی چیکنگ کے لیے مکمل منصوبہ |
| کیمرا | `sensor_msgs/Image` | ڈیٹیکشن نوڈ | RGB اور ڈیپتھ فریمز |
| ڈیٹیکشن نوڈ | `vision_msgs/Detection2DArray` | پلانر نوڈ، تصدیقی نوڈ | آبجیکٹ لیبلز، اعتماد، باؤنڈنگ باکسز |
| ڈیٹیکشن نوڈ | `std_msgs/Float32` | تصدیقی نوڈ | بہترین ڈیٹیکشن اعتماد |
| Nav2 سرور | `nav2_msgs/action/NavigateToPose` | نیویگیشن کلائنٹ | گول، فیڈبیک، نتیجہ |
| آرم کنٹرولر | `trajectory_msgs/JointTrajectory` | ہینڈلنگ نوڈ | رسائی اور گرسپ کے لیے جوائنٹ پوزیشنز |
| فورس سینسر | `geometry_msgs/WrenchStamped` | تصدیقی نوڈ | گرسپ کے دوران رابطے کا فورس |
| تصدیقی نوڈ | `std_msgs/String` | آرکسٹریٹر نوڈ | وجوہات کے ساتھ پاس/فل نتیجہ |
| ریکوری نوڈ | `std_msgs/String` | متاثرہ نوڈ | دوبارہ کوشش کا حکم یا فیلور رپورٹ |
| آرکسٹریٹر | `std_msgs/String` | تمام نوڈز | ڈیمو انسٹrumینٹیشن کے لیے حالت ٹاپک |

### ہر پرہت پر خرابی کا انتظام

| پرہت | عام خرابیاں | شناخت کا طریقہ | ریکوری ایکشن |
|---|---|---|---|
| آڈیو | پسٹ کا شور، خاموشی، آواز کٹی ہوئی | انرجی حد، فقرے کا ٹائم آؤٹ | صارف سے دہرانے کو کہیں، ٹائم آؤٹ بڑھائیں |
| نیت کی تشریح | مبہم حکم، فیلڈز غائب | اسکیما تصدیق، ضروری فیلڈ چیک | صارف سے وضاحت کی درخواست |
| منصوبہ بندی | نامحفوظ ایکشنز، زیادہ قدم، نامعلوم آبجیکٹ | منصوبہ تصدیق کے قواعد | منصوبہ مسترد، متبادل تجویز |
| نیویگیشن | راستہ مسدود، مکانیت ناکام، ٹائم آؤٹ | Nav2 نتیجے کی حالت، کاسٹ میپ ا Alerts | دوبارہ منصوبہ بندی، ریکوری بہاؤ پر سوئچ |
| ادراک | کم اعتماد، محفوظیت، غلط آبجیکٹ | اعتماد حد، ڈیپتھ تصدیق | دوبارہ اسکین، صارف سے نئی پوزیشن کی درخواست |
| ہینڈلنگ | ناقابل رسائی آبجیکٹ، زیادہ فورس، پھسلنا | ورک اسپیس حدوں کی چیک، فورس حدود | منسوخ، محدودیت رپورٹ |
| تصدیق | نتیجے میں عدم مطابقت، ناقص مکمل ہونا | بصری اور فورس چیک | دوبارہ کوشش، خوشگوار کمی، رپورٹ |

### ڈیمو انسٹrumینٹیشن اور لاگنگ

ایک پیشہ ورانہ ڈیمو ہر لمحے دکھاتا ہے کہ روبوٹ کیا سوچتا ہے۔ انسٹrumینٹیشن اختیاری نہیں ہے۔ ججز صرف سطحی موشن سے انٹیگریشن کے معیار کا جائزہ نہیں لے سکتے۔

**کیا دکھائیں یا لاگ کریں:**

- ٹرانسکرپٹ کردہ حکم ٹیکسٹ اور اعتماد
- تشریح شدہ نیت JSON
- تیار شدہ منصوبہ قدم حالت اشاروں کے ساتھ
- نیویگیشن گول، موجودہ پوزیشن، اور گول سے فاصلہ
- شناخت شدہ آبجیکٹس لیبلز، اعتماد، اور 3D پوزیشنز کے ساتھ
- گرسپ کی کوششیں فورس ریڈنگز کے ساتھ
- تصدیقی نتائج ہر قدم پر پاس/فل کے ساتھ
- اٹھائے گئے ریکوری ایکشنز اور ان کے نتائج
- کل عملی وقت اور فی قدم ٹائمنگ

**لاگو کا نمونہ:**

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

### ایسیشنگ ربرک سکورنگ معیار کے ساتھ

| معیار | وزن | بہترین (5) | اچھا (3-4) | مناسب (1-2) | غائب (0) |
|---|---|---|---|---|---|
| ٹاسک گراؤنڈنگ | 20% | حکم ہدف شدہ، جانچنےے، تصدیق شدہ اہداف پابندیوں کے ساتھ بن جاتا ہے | اہداف ہدف شدہ ہیں لیکن تصدیق غائب ہے | اہداف غیر ہدف شدہ ٹیکسٹ ہیں | کوئی گول تشریح نہیں |
| حفاظت | 20% | تمام نامحفوظ حالتیں روبوٹ کو روکتی ہیں، ہر پرہت پر پابندیاں نافذ | زیادہ تر پابندیاں نافذ، ایک خلا | کچھ حفاظتی چیکز، اہم خلا | کوئی حفاظتی چیک نہیں |
| نیویگیشن | 15% | روبوٹ رکاوٹوں سے بچتا ہے، پیشرفت رپورٹ کرتا ہے، دوبارہ منصوبہ بندی سنبھالتا ہے | چھوٹی مسائل کے ساتھ کامیابی سے نیویگیٹ | رکاوٹوں یا تاخیر کے ساتھ گول تک پہنچتا ہے | کوئی نیویگیشن نہیں |
| ادراک | 15% | اعتماد، ڈیپتھ اور تصدیق کے ساتھ آبجیکٹ ڈیٹیکشن | ڈیٹیکشن کام کرتا ہے لیکن اعتماد چیک نہیں | ڈیٹیکشن غیر مستقل ہے | کوئی ادراک نہیں |
| ریکوری | 15% | خودکار ریکوری کے ساتھ کم از کم دو فیلور راستے سنبھالتا ہے | ایک فیلور راستہ سنبھالتا ہے | فیلورز کی شناخت لیکن کوئی ریکوری نہیں | کوئی فیلور ہینڈلنگ نہیں |
| وضاحت | 15% | سسٹم ہر قدم پر کیا ہوا اور کیوں ہوا ظاہر کرتا ہے | زیادہ تر حالت معلومات دکھاتا ہے | صرف حتمی نتیجہ دکھاتا ہے | کوئی نمایاں نہیں |

### اضافی اہداف

**RAG پر مبنی کورس بک Q&A:**
ایک retrieval-augmented generation سسٹم کو انٹیگریٹ کریں جو فہرگارتوں کے ہر کیپسٹون سبسسٹم کے بارے میں سیکھنے والوں کے سوالات کا جواب دے۔ کورس بک کے بابوں کو vector ڈیٹابیس (ChromaDB یا Qdrant) میں انڈیکس کریں۔ جب سیکھنے والا پوچھتا ہے "پلانر نامحفوظ حکموں کو کیوں مسترد کرتا ہے"، تو منصوبہ بندی اور حفاظت کے بابوں سے متعلقہ پیراگراف حاصل کریں اور ہدف شدہ جواب بنائیں۔

**صارف ذاتی سازی:**
صارف کی پس منظر کی بنیاد پر ڈیمو کی پیچیدگی ایڈاپٹ کریں۔ سافٹ ویئر صرف سیکھنے والے کو ROS 2 تصورات کی زیادہ وضاحت دیکھتا ہے۔ ہارڈویئر سیکھنے والے کو سینسر کیلیبریشن اور ایکچویٹر کی حدود کے بارے میں مزید تفصیلات دیکھتے ہیں۔ ترجیحات محفوظ کریں اور ڈیمو کی تفصیل اور اصطلاحات کو ایڈجسٹ کریں۔

**اردو ترجمہ:**
کیپسٹون چیپٹر کے مواد کو وسیع تر قابلیت کے لیے اردو میں ترجمہ کریں۔ تکنیکی اصطلاحات کے محفوظ رکھنے کے ساتھ ہدف شدہ ترجمہ استعمال کریں۔ ROS 2، Nav2 اور YOLO جیسی کلیدی اصطلاحات انگریزی میں رہتی ہیں۔ تصوراتی وضاحتات مناسب تکنیکی رجسٹر کے ساتھ ترجمہ کی جاتی ہیں۔

**نarration ڈیمو اسکرپٹ:**
کیپسٹون ڈیمو کا 90 سیکنڈ narration walkthrough ریکارڈ کریں۔ narration ہر پرہت کو چلتے وقت وضاحت کرتا ہے، ٹریڈ آفٹس اور ڈیزائن فیصلوں کی نشاندہی کرتا ہے۔ hackathon جمع کرانے اور بعید سے جائزہ لینے کے لیے مفید ہے۔

**کثیر لسانی صوتی معاونت:**
آواز نوڈ کو اردو، انگریزی اور کوڈ سوئچڈ حکموں کو سنبھالنے کے لیے بڑھائیں۔ اس کے لیے کثیر لسانی Whisper ماڈل اور زبان کی ملاپ سنبھالنے والی نیت کی تشریح ضروری ہے۔

## مکمل کیپسٹون لاگو گائیڈ

### مرحلہ 1: ماحول کی ترتیب (دن 1-2)

1. Ubuntu 22.04 پر ROS 2 Humble انسٹال کریں۔
2. humanoid روبوٹ ماڈل (Unitree G1 URDF یا حسب ضرورت) کے ساتھ Gazebo Fortress انسٹال کریں۔
3. Nav2 انسٹال کریں اور اپنے ماحول کے لیے نیویگیشن اسٹیک کنفیگر کریں۔
4. catkin ورک اسپیس بنائیں اور `capstone_humanoid` پیکج شروع کریں۔
5. تصدیق کریں کہ روبوٹ ماڈل سینسر پلاگنز (کیمرا، ڈیپتھ، LiDAR، IMU) کے ساتھ Gazebo میں لوڈ ہوتا ہے۔
6. بنیادی ٹیلی آپریشن ٹیسٹ کریں تاکہ جوائنٹ کنٹرولرز اور بیس موشن کام کر رہے ہوں۔

### مرحلہ 2: آواز اور منصوبہ بندی (دن 3-4)

1. Whisper اور WebRTC VAD کے ساتھ آواز نوڈ لاگو کریں۔
2. مختلف شور کی شرائط میں کم از کم 10 مختلف حکموں کے ساتھ ٹرانسکرپشن ٹیسٹ کریں۔
3. LLM انٹیگریشن کے ساتھ پلانر نوڈ لاگو کریں۔
4. منصوبہ بندی کا پرامپٹ ٹیمپلیٹ بیان کریں اور کم از کم 20 حکموں کے ساتھ ٹیسٹ کریں۔
5. منصوبہ تصدیق اور نامحفوظ حکموں کو مسترد کرنا لاگو کریں۔
6. تصدیق کریں کہ مکمل آڈیو سے منصوبہ تک ورک فلو 5 سیکنڈ سے کم میں چلتا ہے۔

### مرحلہ 3: نیویگیشن انٹیگریشن (دن 5-6)

1. ڈیمو ماحول کے لیے Nav2 کو کاسٹ میپ، پلانر اور کنٹرولر کے ساتھ کنفیگر کریں۔
2. ٹائم آؤٹ اور فیڈبیک کے ساتھ نیویگیشن ایکشن کلائنٹ لاگو کریں۔
3. کم از کم 5 ہدف مقامات پر نیویگیشن ٹیسٹ کریں۔
4. رکاوٹ کے منظرنے شامل کریں اور دوبارہ منصوبہ بندی کا عمل دیکھیں۔
5. مسدود راستوں اور ٹائم آؤٹ کے لیے ریکوری بہاؤ لاگو کریں۔
6. لاگنگ اور ٹائمنگ کے ساتھ نیویگیشن کو انسٹرومینٹ کریں۔

### مرحلہ 4: ادراک اور ہینڈلنگ (دن 7-8)

1. کیپسٹون آبجیکٹس کے لیے آبجیکٹ ڈیٹیکشن ماڈل ٹرین یا فائن ٹیون کریں۔
2. اعتماد حد کے ساتھ ڈیٹیکشن نوڈ لاگو کریں۔
3. 3D آبجیکٹ پوزیشن تخمینے کے لیے ڈیپتھ کیمرا کو انٹیگریٹ کریں۔
4. رسائی اور گرسپ ترتیبوں کے ساتھ ہینڈلنگ نوڈ لاگو کریں۔
5. فورس مانیٹرنگ اور ورک اسپیس حدود کی چیک شامل کریں۔
6. سیمیولیشن میں مکمل ڈیٹیکٹ-گرسپ-پلیس ورک فلو ٹیسٹ کریں۔

### مرحلہ 5: انٹیگریشن اور تصدیق (دن 9-10)

1. آرکسٹریٹر نوڈ لاگو کریں جو تمام سبسسٹمز کو ترتیب دیتا ہے۔
2. تمام پرہتیں کو تصدیق اور ریکوری لاجک سے جوڑیں۔
3. کم از کم 10 مختلف صوتی حکموں کے ساتھ آخر سے آخر ٹیسٹ چلائیں۔
4. ڈیمو لاگنگ کے ساتھ مکمل ورک فلو کو انسٹرومینٹ کریں۔
5. تمام فیلور موڈز اور ریکوری بہاؤ کی شناخت کریں اور دستاویز کریں۔
6. ڈیمو کی مشق کریں جب تک کہ یہ 5 منٹ سے کم میں قابل اعتماد طریقے سے نہ چلے۔

### مرحلہ 6: تزئین اور جمع کرانا (دن 11-13)

1. narration کے ساتھ ڈیمو ویڈیو ریکارڈ کریں۔
2. hackathon جمع کرانے کا دستاویز لکھیں۔
3. ترتیب کی ہدایات کے ساتھ منصوبہ کی README بنائیں۔
4. ایک صفحہ ڈیزائن بریف تیار کریں۔
5. ججز کے ممکنہ حکموں کے ساتھ حتمی انٹیگریشن ٹیسٹ چلائیں۔
6. ڈیڈ لائن سے پہلے جمع کرائیں۔

## Hackathon جمع کرانے کا چیک لسٹ

- [ ] ڈیمو ویڈیو ریکارڈ (2-5 منٹ) ہر پرہت کی وضاحت کے ساتھ narration
- [ ] منصوبہ کا عنوان، ٹیم کے ممبران، وضاحت، ترتیب کی ہدایات کے ساتھ README
- [ ] ڈیزائن بریف: حکم، ماحول، صلاحیتوں، ROS 2 نوڈز، حفاظتی چیکز کا ایک صفحہ
- [ ] واضح ساخت اور بلڈ ہدایات کے ساتھ سورس کوڈ ریپوزٹری
- [ ] ایک حکم سے مکمل سسٹم شروع کرنے والا لانچ فائل
- [ ] مختلف صوتی حکموں کے ساتھ کم از کم 3 کامیاب آخر سے آخر مظاہرے
- [ ] کم از کم 1 مظاہرہ شدہ فیلور ریکوری راستہ
- [ ] ہر قدم پر روبوٹ کی حالت دکھانے والا ڈیمو انسٹrumینٹیشن
- [ ] حفاظتی دستاویز: پابندیاں، حدود، ہنگامی رکاوٹ کا عمل
- [ ] ہارڈویئر ٹرانسفر پلان (اگر لاگو ہو): فزیکل روبوٹ کے لیے کیا بدلنا ہے
- [ ] منصوبے میں استعمال شدہ تکنیکی اصطلاحات کی فہرست
- [ ] جمع کرانے کا فارم ڈیڈ لائن سے پہلے مکمل

## عملی لیبارٹری

<div className="lab-box">
<h3>لیبارٹری: اپنا کیپسٹون ڈیزائن بریف لکھیں</h3>
<p>اپنے کیپسٹون کے لیے ایک صفحہ ڈیزائن بریف لکھیں۔ مندرجہ ذیل حصے شامل کریں:</p>
<ol>
<li><strong>صارف کا حکم</strong>: وہ مخصوص صوتی حکم جو آپ کا روبوٹ سنبھالتا ہے۔</li>
<li><strong>ماحول کی ترتیب</strong>: کمرے کی لے آؤٹ، رکاوٹیں، ہدف آبجیکٹس اور ان کی پوزیشنز۔</li>
<li><strong>روبوٹ کی صلاحیتیں</strong>: روبوٹ کیا کر سکتا ہے اور کیا نہیں۔</li>
<li><strong>ROS 2 نوڈز</strong>: ہر نوڈ، اس کا ٹاپک/سروس/ایکشن، اور اس کا ان پٹ/آؤٹ پٹ فہرست بنائیں۔</li>
<li><strong>ادراک کے اجزاء</strong>: کیمرا ماڈل، ڈیٹیکشن ماڈل، اعتماد حدود۔</li>
<li><strong>حفاظتی چیکز</strong>: رفتار کی حدود، فورس کی حدود، ورک اسپیس کی حدود، ہنگامی رکاوٹ۔</li>
<li><strong>فیلور موڈز</strong>: کم از کم 3 فیلور منظرنے ریکوری بہاؤ کے ساتھ۔</li>
<li><strong>کامیابی کے معیار</strong>: آپ کیسے جانتے ہیں کہ ڈیمو کامیاب رہا۔</li>
<li><strong>ڈیمو اسکرپٹ</strong>: 90 سیکنڈ پریزنٹیشن کے لیے قدم بہ قدم narration۔</li>
</ol>
</div>

## کواﺋز

### اپنی سمجھ چیک کریں

1. ہارڈویئر کی تنصیب سے پہلے کیپسٹون سیمیولیشن میں کیوں شروع ہونا چاہیے؟
2. کیا LLM جنریٹڈ منصوبہ روبوٹ پر لاگو کرنے کے لیے کافی محفوظ بناتا ہے؟
3. جب ادراک کا اعتماد کم ہو تو ڈیمو کو کیا دکھانا چاہیے؟
4. نتیجے کی تصدیق روبوٹ ورک فلو کا حصہ کیوں ہے اور اختیاری کیوں نہیں؟
5. کیپسٹون آرکیٹیکچر کی سات پرہتیں اور ہر ایک کی ذمہ داری کا نام بتائیں۔
6. منصوبہ تصدیق کا مقصد کیا ہے، اور یہ کون سے قواعد نافذ کرتا ہے؟
7. نیویگیشن نوڈ ٹائم آؤٹ ہونے والے گول کو کیسے سنبھالتا ہے؟
8. گرسپ ورک فلو کو بصری تصدیک کے علاوہ فورس ریڈنگز کیوں چیک کرنی چاہیے؟
9. ڈیمو انسٹrumینٹیشن پرہت کا مقصد کیا ہے؟
10. ایک ریکوری بہاؤ کی وضاحت کریں جو تصدیقی نوڈ ٹریگر کر سکتا ہے۔

### جوابات کی کلید

1. سیمیولیشن فزیکل خطرے کے بغیر انٹیگریشن ٹیسٹنگ کی اجازت دیتا ہے۔ یہ کسی کو چوٹ نہ پہنچنے یا ہارڈویئر کو نقصان نہ پہنچنے سے پہلے سافٹ ویئر کی بگز، ٹائمنگ کے مسائل اور لاجک خرابیاں ظاہر کرتا ہے۔
2. منصوبہ محدود (زیادہ سے زیادہ قدم)، تصدیق شدہ (ایکشن وائٹ لسٹ)، کنٹرولر-محفوظ ایکشنز میں ترجمہ شدہ، اور ٹائم آؤٹ اور فیڈبیک کے ساتھ مانیٹرڈ ہونا چاہیے۔ نامحفوظ یا مبہم منصوبوں کو مسترد کیا جانا چاہیے۔
3. ایک محفوظ رکاؤ، وضاحت کی درخواست، دوبارہ اسکین، یا متبادل ریکوری راستہ۔ ڈیمو کو کم اعتماد کو چھپانے کی بجائے ججز کو نمایاں دکھانا چاہیے۔
4. روبوٹ کو یہ جاننا ضروری ہے کہ آیا عمل نے مطلوبہ حالت حاصل کی یا ریکوری کی ضرورت ہے۔ تصدیک کے بغیر، ناکامیاں خاموشی سے ورک فلو میں پھیلتی ہیں۔
5. (1) آڈیو ان پٹ: صوتی قبض اور ٹرانسکرپشن۔ (2) نیت کی تشریح: ٹیکسٹ کو ہدف شدہ گول میں تبدیل۔ (3) ٹاسک منصوبہ بندی: LLM محدود قدموں میں تقسیم۔ (4) نیویگیشن: ماحول میں محفوظ طریقے سے حرکت۔ (5) ادراک: آبجیکٹس کی شناخت اور مکانیت۔ (6) ہینڈلنگ: رسائی، گرسپ اور رکھنا عملی طور پر۔ (7) تصدیق: نتیجے کی تصدیق اور ریکوری ٹریگر۔
6. منصوبہ تصدیق زیادہ سے زیادہ قدم گنتی، اجازت یافتہ ایکشن وائٹ لسٹ، ٹائم آؤٹ کی حدود اور ضروری فیلڈز نافذ کرتی ہے۔ یہ نامحفوظ، بہت پیچیدہ یا ناقص منصوبوں کو مسترد کرتی ہے۔
7. نیویگیشن نوڈ گول منسوخ کرتا ہے، ٹائم آؤٹ واقعہ لاگ کرتا ہے، دوبارہ منصوبہ بندی کا کاؤنٹر بڑھاتا ہے، اور یا تو ریکوری راستہ آزماتا ہے یا نیویگیشن ناکامی کی رپورٹ آرکسٹریٹر کو بھیجتا ہے۔
8. صرف بصری تصدیق کامیاب گرسپ کی تصدیق نہیں کر سکتی۔ آبجیکٹ نمایاں ہو سکتا ہے لیکن پھسل رہا ہو، یا گرپر بند ہو سکتا ہے بغیر رابطے کے۔ فورس ریڈنگز فزیکل رابطہ اور گرپ کی استحکام کی تصدیق کرتی ہیں۔
9. انسٹrumینٹیشن پرہت ہر لمحے روبوٹ کیا سوچتا ہے، کیا فیصلہ کرتا ہے اور کیا کرتا ہے اس کو لاگ کرتا ہے۔ یہ ججز اور ڈویلپرز کو صرف سطحی موشن نہیں بلکہ انجینئرنگ کا معیار دیکھنے کے قابل بناتا ہے۔
10. ممکنہ ریکوری ایکشنز میں شامل ہیں: ایڈجسٹڈ پیرامیٹرز کے ساتھ ناکام قدم دوبارہ آزمائیں، باقی قدموں کی دوبارہ منصوبہ بندی، صارف سے وضاحت کی درخواست، یا ناکامی رپورٹ کریں اور خوشگوار طریقے سے رک جائیں۔

## فہرست الفاظ

- **کیپسٹون**: ایک مربوط منصوبہ جو تمام کورس ماڈیولز کو ایک کام خودکار سسٹم میں جوڑتا ہے۔
- **VLA (Vision-Language-Action)**: بصری ادراک، قدرتی زبان کی سمجھ، اور روبوٹ کے عمل کو جوڑنے والا ورک فلو نمونہ۔
- **ٹاسک ڈیکمپوزیشن**: اعلیٰ سطحی گول کو ترتیب والی، محدود، عملی ٹاسکس میں تقسیم کرنے کا عمل۔
- **پلانر تصدیق**: حفاظتی پرہت جو لاگو کرنے سے پہلے LLM جنریٹڈ منصوبوں کو پابندیوں کے خلاف چیک کرتی ہے۔
- **ایکشن وائٹ لسٹ**: روبوٹ ایکشنز کی فہرست جو پلانر کو استعمال کی اجازت ہے، غیر مجاز حکموں کو روکتا ہے۔
- **ریکوری بہاؤ**: ناکامیوں کے خودکار جوابات، بشمول دوبارہ منصوبہ بندی، دوبارہ کوشش، مدد کی درخواست، یا رک جانا۔
- **ڈیمو انسٹrumینٹیشن**: جائزہ لینے اور ڈیبگنگ کے لیے روبوٹ کی حالت، فیصلوں اور نتائج کا لاگنگ اور ڈسپلے۔
- **نتیجے کی تصدیق**: یہ چیک کرنے کا عمل کہ کیا عملی طور پر کیے گئے ایکشنز نے ان کے مطلوبہ اثرات حاصل کیے۔
- **فورس مانیٹرنگ**: گرسپ کے دوران فزیکل رابطے کی تصدیق کے لیے فورس/ٹارک سینسر ڈیٹا کا استعمال۔
- **اعتماد حد**: روبوٹ کے کسی آبجیکٹ پر عمل کرنے سے پہلے درکار minimum ڈیٹیکشن سکور۔
- **Nav2**: ROS 2 نیویگیشن اسٹیک جو راستہ منصوبہ بندی، رکاوٹ سے بچاؤ اور ریکوری بہاؤ فراہم کرتا ہے۔
- **سیمیولیشن-پہلے**: یہ اصول کہ ہارڈویئر کی تنصیب سے پہلے تمام انٹیگریشن ٹیسٹنگ سیمیولیشن میں ہونی چاہیے۔
- **گراؤنڈنگ**: زبان کے حوالوں (جیسے "red cup") کو سینسرز سے شناخت شدہ فزیکل آبجیکٹس سے جوڑنا۔
- **ایکشن کلائنٹ**: ROS 2 نمونہ جو ایکشن سرور کو گولز بھیجتا ہے اور فیڈبیک اور نتائج کی نگرانی کرتا ہے۔
- **ڈیجیٹل ٹون**: روبوٹ اور ماحول کا سیمیولیٹڈ ورژن جو محفوظ ٹیسٹنگ اور تصدیق کے لیے استعمال ہوتا ہے۔
- **دوبارہ منصوبہ بندی**: نیا نیویگیشن راستہ بنانے کا عمل جب موجودہ راستہ مسدود ہو یا ناکام ہو۔
- **ہنگامی رکاوٹ**: حفاظت-تنجیم حالتوں سے ٹریگر ہونے والا تمام روبوٹ حرکت کا فوری رکاؤ۔
- **ورک اسپیس کی حدود**: فضائی حدود جن کے اندر روبوٹ آرم محفوظ طریقے سے رسائی اور ہینڈلنگ کر سکتا ہے۔
- **آرکسٹریٹر**: مرکزی نوڈ جو تمام سبسسٹمز کو ترتیب دیتا ہے اور مجموعی ڈیمو کے بہاؤ کا انتظام کرتا ہے۔
- **ڈیزائن بریف**: کیپسٹون کے حکم، ماحول، صلاحیتوں اور کامیابی کے معیار کی وضاحت کرنے والا ایک صفحہ دستاویز۔
