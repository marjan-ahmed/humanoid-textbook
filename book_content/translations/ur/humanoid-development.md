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

# ہیومانائڈ ڈویلپمنٹ

<PersonalizationToolbar chapterSlug="humanoids/humanoid-development" />

## سیکھنے کے نتائج

اس باب کے اختتام پر، آپ یہ کر سکیں گے:

- ہیومانائڈ روبوٹس کے لیے دو پاؤں کی چال، مجموعی مانپلیشن، اور ریئل ٹائم بیلنس کنٹرول میں اہم انجینئرنگ چیلنجز کی شناخت کریں۔
- ملٹی ڈی او ایف مفصل شدہ نظاموں کے لیے فوروارڈ کینی میٹکس، انورس کینی میٹکس، اور جیکوبین پر مبنی کنٹرول کی وضاحت کریں۔
- کینٹر آف ماس ٹریجیکٹریز کا حساب لگائیں اور اسٹیٹک اور ڈائنامک اسٹیبلٹی معیارات کا جائزہ لیں بشمول زیرو مومنٹ پوائنٹ (ZMP) اور کیپچر پوائنٹ۔
- چلنے، بھاگنے، سیڑھی چڑھنے، اور زمین کے ڈھانچے کے موافق کے لیے گیٹ پیٹرن ڈیزائن اور موازنہ کریں۔
- ہیومانائڈ ہینڈز کے ساتھ چست مانپلیشن کے لیے فورس اور ٹارک کنٹرول حکمت عملیوں کو لاگو کریں۔
- پراکسیمکس، جیسچر، اور انٹینٹ کمیونیکیشن سمیت سوشل روبوٹکس کے اصولوں کو انسان-روبوٹ انٹریکشن پر لاگو کریں۔
- ہیومانائڈ ہارڈویئر پلیٹ فارموں (Unitree G1, H1, Go2, Robotis OP3, Hiwonder TonyPi) کا کمپیوٹ، ایکچویٹرز، سینسرز، پیلوڈ، اور قیمت کے لحاظ سے موازنہ کریں۔
- ایک اسٹیجڈ لیب حکمت عملی بنائیں جو صرف سیمیولیشن سے لے کر مکمل ہیومانائڈ تعیناتی تک حقیقی بجٹ اور حفاظت کی پابندیوں کے اندر پھیلتی ہے۔

## تصور کی وضاحت

### کیوں ہیومانائڈ فارم فیکٹرز اہم ہیں

ہیومانائڈ روبوٹس ان ماحول کے لیے انجینئر کیے گئے ہیں جو لوگوں کے گرد بنائے گئے ہیں۔ دروازے، سیڑھیاں، میزیں، ٹول کے ہینڈلز، شیلف، اور کچن کے آلات سب انسان جسمانی منصوبے کو فرض کرتے ہیں: ایک کھڑا دھڑ، دو مفصل شدہ بازو جن میں ہاتھ ہیں، دو ٹانگیں جن میں گٹنے اور کولہے کے جوڑ ہیں، اور ایک سر جس میں کیمرے اور مائیکروفون ہوتے ہیں۔ یہ شکلی تعلق کا مطلب ہے کہ ایک ہیومانائڈ اصولی طور پر وہی ٹولز استعمال کر سکتا ہے، وہی راستے پر چل سکتا ہے، اور وہی انٹرفیسز کے ساتھ انٹریکٹ کر سکتا ہے جیسے ایک انسان آپریٹر کرتا ہے۔ یہ ہیومانائڈ فارم فیکٹر کا مرکزی م命题 ہے: انسانی جگہوں میں تجسم ماحول کی ترمیم کی ضرورت کو کم کرتا ہے۔

تاہم، یہ شکلی فائدہ بہت بڑی کنٹرول لاگت کے ساتھ آتا ہے۔ ایک ہیومانائڈ جس میں 28 ڈیگریز آف فریڈم (DOF) ہیں، کو 28 ایکچویٹرز کو ایک ساتھ کوآرڈینیٹ کرنا ہوتا ہے جبکہ چھوٹے سپورٹ پولیگون پر دو پاؤں پر متحرک توازن برقرار رکھنا ہوتا ہے۔ چھوٹی غلطیاں غیر خطی طور پر جمع ہوتی ہیں: 5 ملی میٹر کی پاؤں کی پوزیشننگ کی غلطی کینٹر آف ماس کو منتقل کرتی ہے، جو دھڑ کو غیر مستحکم کرتی ہے، جو بازوؤں کو بیلنس کے لیے جھولا جھلنے پر مجبور کرتی ہے، جو کسی بھی جاری مانپلیشن کے کام کو متاثر کرتی ہے۔ سبسسٹمز کے درمیان کا ٹائی ہیومانائڈ روبوٹکس کو اپلائیڈ کنٹرول تھیوری میں سب سے مشکل مسائل میں سے ایک بنا دیتا ہے۔

### کنٹرول اسٹیک

ایک ہیومانائڈ کنٹرول اسٹیک تہوں میں منظم ہوتا ہے، ہر تہہ مختلف فریکوئنسی اور تجرید سطح پر کام کرتی ہے:

1. **جوائنٹ لیول ٹارک کنٹرول** (1 kHz): ہر ایکچویٹر کو PID یا امپڈنس کنٹرولر کی بنیاد پر ٹارک کمانڈ ملتی ہے۔ یہ تہہ اعلیٰ سطح کی حفاظت کی حدود، کرنٹ سیچوریشن، اور بیکلش کمپنسیشن کو سنبھالتی ہے۔
2. **مجموعی کنٹرول** (500 Hz): ایک کواڈراٹک پروگرام یا آپریشنل اسپیس کنٹرولر مطلوبہ اینڈ ایفیکٹر فورسز اور ٹارکز کو تمام جوائنٹس میں تقسیم کرتا ہے جبکہ فرکشن کون، ٹارک لیمٹس، اور بیلنس کنسٹرینٹس کی پابندی کرتا ہے۔
3. **موشن پلاننگ** (50-100 Hz): ایک پلانر پاؤں کے قدم، بازوؤں کی رسائی، اور دھڑ کی دوبارہ سمت بنیاد کے لیے قابل عمل ٹریجیکٹریز بناتا ہے۔ یہ پیشگوئی کنٹرول یا ماڈل پریڈکٹو کنٹرول (MPC) استعمال کرتا ہے تاکہ مستقبل کے قدموں کا اندازہ لگایا جا سکے۔
4. **پرپشن** (10-30 Hz): ڈیپتھ کیمرے، lidar، اور ٹیکٹائل سینسرز ایک اسٹیٹ اسٹیمیٹر کو فیڈ کرتے ہیں جو روبوٹ کو مقامی بناتا ہے، رکاوٹوں کی شناخت کرتا ہے، اور منظر میں انسانوں کو ٹریک کرتا ہے۔
5. **ٹاسک لیول ریزننگ** (1-10 Hz): ایک اعلیٰ سطح کا پلانر یا سیکھا ہوا پالیسی کام منتخب کرتا ہے، وسائل تقسیم کرتا ہے، اور ناکامیوں اور دوبارہ کوششوں کو سنبھالتا ہے۔

### اہم انجینئرنگ چیلنجز

| چیلنٹ | کیوں مشکل ہے | ناکامی کا طریقہ |
|---|---|---|
| م.dynamic balance | سپورٹ پولیگون چھوٹا ہے؛ روبوٹ ہمیشہ حصوی طور پر گر رہا ہوتا ہے | گرنا، ہارڈویئر کو نقصان |
| رابطہ عبور | پاؤں-زمین رابطہ ہائبرڈ ہے (ڈسکریٹ + مسلسل) | ٹھوکر کھانا، پھسلنا |
| مجموعی ہماہنگی | 20+ DOF بیلنس اور مومنٹم کے ذریعے ٹائے گئے ہیں | کام میں ناکامی، دہلنا |
| حرکت کے تحت پرپشن | کیمرے کی تصاویر جسم کی حرکت سے دھندلی اور منتقل ہوتی ہیں | مقامی بنانے میں غلطی |
| بیٹری لائف | زیادہ طاقت والے ایکچویٹرز بیٹریوں کو منٹوں میں ختم کر دیتے ہیں | مشن ٹائم آؤٹ |
| پیلوڈ بمقابلہ وزن | زیادہ پیلوڈ کو بڑے ایکچویٹرز کی ضرورت ہوتی ہے، جو وزن بڑھاتے ہیں | موبیلٹی میں کمی |
| انسانوں کے ساتھ حفاظت | سخت لنکس اور زیادہ ٹارک والے ایکچویٹرز لوگوں کو زخمی کر سکتے ہیں | زخم، ذمہ داری |

## ویژل ماڈل: ہیومانائڈ کنٹرول تہوں

<div className="visual-panel">
<div className="visual-flow">
<div className="flow-step"><span>جسم</span>لنکس، جوائنٹس، ایکچویٹرز، ہاتھ، پاؤں</div>
<div className="flow-step"><span>بیلنس</span>کینٹر آف ماس، ZMP، کیپچر پوائنٹ، گیٹ فیز</div>
<div className="flow-step"><span>پرپشن</span>ڈیپتھ، lidar، IMU، فورس/ٹارک، آبجیکٹ اسٹیٹ، انسان کی موجودگی</div>
<div className="flow-step"><span>موشن پلاننگ</span>پاؤں کے قدم کا منصوبہ، بازو کی ٹریجیکٹری، مجموعی QP</div>
<div className="flow-step"><span>مانپلیشن</span>رسائی، گرپ، فورس ریگولیشن، چھوڑنا</div>
<div className="flow-step"><span>انٹریکشن</span>گفتگو، نظر، جیسچر، نیت، پراکسیمکس</div>
</div>
</div>

## ڈیپ ڈائیو سبٹاپکس

### فوروارڈ اور انورس کینی میٹکس

#### فوروارڈ کینی میٹکس

فوروارڈ کینی میٹکس (FK) جوائنٹ کونوں کا ویکٹر دیے جانے پر ہر لنک کی پوزیشن اور آریئنٹیشن کا حساب لگاتا ہے۔ $n$ جوائنٹس کی ایک سیریل چین کے لیے، FK ہوموجینیس ٹرانسفارمیشن میٹرکسز کا استعمال کرتے ہوئے بیان کیا جاتا ہے:

$$
T_i^\{i-1\} = \begin\{bmatrix\}
R_i(\theta_i) & d_i \\
0 & 1
\end\{bmatrix\}
$$

جہاں $R_i(\theta_i)$ جوائنٹ $i$ کے لیے $3 \times 3$ رولیشن میٹرکس ہے (Denavit-Hartenberg پیرامیٹرز $\alpha_i, a_i, d_i, \theta_i$ سے متعین) اور $d_i$ ٹرانسلیشن ویکٹر ہے۔ بیس کے لحاظ سے اینڈ ایفیکٹر کی پوز ہے:

$$
T_n^0 = T_1^0 \cdot T_2^1 \cdot \ldots \cdot T_n^\{n-1\} = \prod_\{i=1\}^\{n\} T_i^\{i-1\}
$$

انڈ ایفیکٹر کی پوزیشن $T_n^0$ کے آخری کالَم سے حاصل کی جاتی ہے، اور اس کی آریئنٹیشن اوپریں بائیں $3 \times 3$ سب میٹرکس سے۔

#### انورس کینی میٹکس

انورس کینی میٹکس (IK) سوال کا جواب دیتا ہے: مطلوبہ اینڈ ایفیکٹر پوز $T_d$ دیے جانے پر، جوائنٹ ویکٹر $\mathbf\{q\}$ تلاش کریں جیسے $FK(\mathbf\{q\}) = T_d$۔ ریڈنڈنٹ مینیپولیٹرز کے لیے (کام سے زیادہ DOF)، IK غیر مکمل ہے اور اضافی بہترین کرٹیریا کی ضرورت ہوتی ہے (مثلاً، جوائنٹ ٹارک کو کم سے کم کرنا، سنگولریٹیز سے بچنا، مینیپولیبلٹی کو زیادہ سے زیادہ کرنا)۔

جیکوبین پر مبنی IK حل جیومیٹریک جیکوبین $J(\mathbf\{q\})$ استعمال کرتا ہے:

$$
\dot\{\mathbf\{x\}\} = J(\mathbf\{q\}) \dot\{\mathbf\{q\}\}
$$

ایک ڈیمپڈ لیسٹ اسکوائرز IK قدم یہ ہے:

$$
\Delta \mathbf\{q\} = J^T (J J^T + \lambda^2 I)^\{-1\} \Delta \mathbf\{x\}
$$

جہاں $\Delta \mathbf\{x\}$ پوز ایرر ہے اور $\lambda$ ڈیمپنگ فیکٹر ہے جو سنگولریٹیز کے قریب بیماری سے بچاتا ہے۔ عمل میں، IK ہر کنٹرول سائیکل (50-500 Hz) میں حل کیا جاتا ہے تاکہ وقت کے ساتھ بدلنے والی ٹریجیکٹریز کو ٹریک کیا جا سکے۔

#### ہیومانائڈ ٹانگوں کے لیے کینی میٹکس

6 DOF والی ہیومانائڈ ٹانگ کے لیے (کولہے پر 3، گٹنے پر 1، گھٹنے پر 2)، IK جوائنٹ کونوں دیے جانے پر کولہے کے لحاظ سے پاؤں کی پوز کا حساب لگاتا ہے، یا الٹ جوائنٹ کونوں کا حساب لگاتا ہے تاکہ پاؤں کو مطلوبہ جگہ پر رکھا جا سکے۔ ٹانگ IK درج ذیل کے لیے ضروری ہے:

- **پاؤں کے قدم کی جگہ**: ہرنگ فیز کے دوران پاؤں کو ٹارگٹ پوزیشن پر رکھنے کے لیے کولہے اور گٹنے کے کونوں کا حساب لگانا۔
- **بیلنس ایڈجسٹمنٹ**: زمین کے لحاظ سے دھڑ کو جھکانے کے لیے گھٹنے کے کونوں کا حساب لگانا۔
- **زمین کے ڈھانچے کا موافق**: کونوں یا سیڑھی کی اونچائی کے مطابق پاؤں کی سمت بدلنا۔

### کینٹر آف ماس اور بیلنس

#### کینٹر آف ماس کا حساب

ایک ہیومانائڈ کا کینٹر آف ماس (CoM) تمام لنکس کی ماس وزنی اوسط پوزیشن ہے:

$$
\mathbf\{r\}_\{CoM\} = \frac\{\sum_\{i=1\}^\{N\} m_i \mathbf\{r\}_i\}\{\sum_\{i=1\}^\{N\} m_i\}
$$

جہاں $m_i$ لنک $i$ کا ماس ہے اور $\mathbf\{r\}_i$ لنک $i$ کے کینٹر آف ماس کی دنیا کے فریم میں پوزیشن ہے۔ 20 لنکس والی ہیومانائڈ کے لیے، اس کے لیے ہر لنک کی FK کو ٹریک کرنا اور ان کے حصوں کا مجموعہ لینا ضروری ہے۔

CoM رفتار ہے:

$$
\dot\{\mathbf\{r\}\}_\{CoM\} = \frac\{\sum_\{i=1\}^\{N\} m_i \dot\{\mathbf\{r\}\}_i\}\{\sum_\{i=1\}^\{N\} m_i\}
$$

اور CoM تیزی ہے:

$$
\ddot\{\mathbf\{r\}\}_\{CoM\} = \frac\{\sum_\{i=1\}^\{N\} m_i \ddot\{\mathbf\{r\}\}_i\}\{\sum_\{i=1\}^\{N\} m_i\}
$$

بیلنس کنٹرول کے لیے، CoM کی زمین کے سطح پر پراجیکشن سپورٹ پولیگون کے اندر یا اس کے قریب رہنا چاہیے (پاؤں کے رابطہ پوائنٹس کا محدب محیط)۔

#### زیرو مومنٹ پوائنٹ (ZMP)

ZMP وہ پوائنٹ ہے جہاں زمین کی رد عمل کی طاقتوں کا مجموعہ افقی محوروں کے بارے میں صفر ہوتا ہے۔ بیلنس کے لیے ZMP شرط ہے:

$$
\mathbf\{p\}_\{ZMP\} = \mathbf\{r\}_\{CoM\} - \frac\{\ddot\{\mathbf\{r\}\}_\{CoM\} \cdot z_\{CoM\}\}\{g + \ddot\{z\}_\{CoM\}\}
$$

جہاں $z_\{CoM\}$ CoM کی اونچائی ہے اور $g$ گریویٹیشنل ایکسلریشن ہے۔ اگر $\mathbf\{p\}_\{ZMP\}$ سپورٹ پولیگون کے اندر ہے، تو روبوٹ اسٹیٹک طور پر مستحکم ہے۔ اگر یہ باہر ہے، تو روبوٹ الٹ جائے گا۔

#### کیپچر پوائنٹ

کیپچر پوائنٹ (CP) ZMP تجزیے کو متحرک چال میں بڑھاتا ہے۔ یہ وہ پوائنٹ ہے جہاں روبوٹ کو اگلے پاؤں کا قدم رکھنا ہوگا تاکہ مکمل طور پر رک جائے:

$$
\mathbf\{r\}_\{CP\} = \mathbf\{r\}_\{CoM\} + \frac\{\dot\{\mathbf\{r\}\}_\{CoM\}\}\{\omega_0\}
$$

جہاں $\omega_0 = \sqrt\{g / z_\{CoM\}\}$ لکیری الٹے پینڈولم ماڈل کی قدرتی فریکوئنسی ہے۔ اگر کیپچر پوائنٹ سپورٹ پولیگون کے اندر ہے، تو روبوٹ رک سکتا ہے۔ اگر یہ باہر ہے، تو روبوٹ گرے بغیر یا ایک اضافی قدم لیے بغیر نہیں رک سکتا۔

#### لکیری الٹے پینڈولم ماڈل (LIPM)

LIPM دو پاؤں کی چال کا سب سے آسان متحرک ماڈل ہے۔ یہ فرض کرتا ہے کہ CoM مستقل اونچائی $z_\{CoM\}$ پر حرکت کرتا ہے، اور افقی ڈائنامکس علیحدہ ہوتی ہے:

$$
\ddot\{x\} = \frac\{g\}\{z_\{CoM\}\} (x - p_x)
$$
$$
\ddot\{y\} = \frac\{g\}\{z_\{CoM\}\} (y - p_y)
$$

جہاں $(p_x, p_y)$ ZMP کی جگہ ہے۔ یہ لکیری ماڈل پیشگوئی کنٹرول اور گیٹ پلاننگ کے لیے MPC فراہم کرتا ہے۔

### گیٹ پیٹرنز

#### چلنے کا گیٹ

دو پاؤں کے چلنے کا گیٹ ناپہنے اور ہرنگ فیز کے متبادل سے بنا ہوتا ہے:

1. **ڈبل سپورٹ**: دونوں پاؤں زمین پر۔ CoM ایک پاؤں سے دوسرے پر منتقل ہوتا ہے۔ مدت: گیٹ سائیکل کا 10-20%۔
2. **سنگل سپورٹ (ناپہنے)**: ایک پاؤں زمین میں قائم ہے۔ CoM ناپہنے والے پاؤں کے اوپر سے گزرتا ہے۔ مدت: گیٹ سائیکل کا 40-50%۔
3. **ہرنگ**: آزاد ٹانگ آگے ہلتی ہے۔ گٹنا زمین سے صاف ہونے کے لیے مڑتا ہے۔ مدت: گیٹ سائیکل کا 30-40%۔

چلنے والے پیٹرن جنریٹر ایک CoM ٹریجیکٹری کا حساب لگاتا ہے (عام طور پر لیٹرل اور سیگیٹل پلنوں میں ہارمونک یا کیوبک اسپلائن) اور پاؤں کی جگہیں، پھر LIPM یا پیشگوئی کنٹرول استعمال کرتا ہے تاکہ جوائنٹ ٹریجیکٹریز بنائی جا سکیں۔

#### بھاگنے کا گیٹ

بھاگنے میں ایک فلائٹ فیز (دونوں پاؤں زمین سے باہر) شامل ہوتی ہے اور زیادہ ایکچویٹر پاور کی ضرورت ہوتی ہے۔ چلنے سے اہم فرق:

- **فلائٹ فیز**: گیٹ سائیکل کا 20-40%۔ CoM ایک بیلسٹک پیرابولا کی پیروی کرتا ہے۔
- **زیادہ ضربت کی طاقتیں**: لینڈنگ فورسز جسم کے وزن کا 2-3 گنا تک پہنچ سکتی ہیں۔
- **لچکدار توانائی کا ذخیرہ**: کندھوں یا اسپرنگز پش آف کے دوران توانائی جمع اور ریلیز کرتے ہیں۔
- **چھوٹا زمین رابطہ وقت**: تیز تر ایکچویٹر ریسپانس کی ضرورت ہوتی ہے۔

بھاگنے والے گیٹ عام طور پر اسپرنگ-ماس ماڈلز یا سینٹرائیڈل مومنٹم ڈائنامکس کا استعمال کرتے ہوئے بنائے جاتے ہیں۔

#### سیڑھی چڑھنا

سیڑھی چڑھنے کے لیے ضروری ہے:
- **درست پاؤں کی جگہ**: ہر قدم کو کافی کلیئرنس کے ساتھ ٹریڈ پر لینا ہوتا ہے۔
- **زیادہ گٹنے کی اونچائی**: ہرنگ ٹانگ کو رائزر کی اونچائی سے صاف ہونا ہوتا ہے۔
- **عمودی CoM ڈسپلیسمنٹ**: ہر قدم میں CoM کو رائزر کی اونچائی تک اٹھنا ہوتا ہے۔
- **زیادہ جوائنٹ ٹارک**: کولہے اور گٹنے کے ٹارک گریویٹی کے خلاف جسم کا وزن اٹھانے کی وجہ سے نمایاں طور پر بڑھ جاتے ہیں۔

سیڑھی چڑھنا عام طور پر ایک قدم بڑھنے والی CoM ٹریجیکٹری اور ترمیم شدہ پاؤں کے قدم کے پلانر کا استعمال کرتے ہوئے منصوبہ بندی کیا جاتا ہے جو ڈسکریٹ اونچائی کی تبدیلیوں کو مدنظر رکھتا ہے۔

#### زمین کے ڈھانچے کا موافق

غیر ہموار زمین کے لیے ضروری ہے:
- **پاؤں کی سمت کا کنٹرول**: گھٹنے کو زمین کے ڈھانچے کے مطابق ہونا ہوتا ہے۔
- **متغیر قدم کی اونچائی**: ہرنگ ٹانگ کی ٹریجیکٹری کو رکاوٹوں کے مطابق ہونا چاہیے۔
- **ریئل ٹائم پرپشن**: ڈیپتھ کیمرہ یا فورس سینサー روبوٹ سے آگے کی زمین کی جیومٹری کا پتہ لگاتا ہے۔
- **ری ایکٹو ری پلاننگ**: اگر پاؤں کا رابطہ غیر متوقع ہے (مثلاً، پھسلنا)، تو پلانر کو فوری طور پر ریکوری قدم بنانا ہوتا ہے۔

### مانپلیشن کے لیے فورس اور ٹارک کنٹرول

#### امپڈنس کنٹرول

امپڈنس کنٹرول اینڈ ایفیکٹر پوزیشن ایرر اور انٹریکشن فورس کے درمیان تعلق کو منظم کرتا ہے:

$$
\mathbf\{F\} = K (\mathbf\{x\}_d - \mathbf\{x\}) + D (\dot\{\mathbf\{x\}\}_d - \dot\{\mathbf\{x\}\})
$$

جہاں $K` سٹفنس میٹرکس ہے اور $D` ڈیمپنگ میٹرکس ہے۔ کم $K` والا ایک لچکدار ہیومانائڈ بازو غیر ضروری فورس کے بغیر آرام سے آبجیکٹس کو چھو سکتا ہے، جبکہ زیادہ $K` والا ایک سخت بازو درست پوزیشننگ حاصل کرتا ہے۔

#### گرپ پلاننگ

ہیومانائڈ ہاتھوں کے لیے گرپ پلاننگ میں شامل ہیں:

1. **پری-گرپ کنفیگریشن**: ہاتھ کو آبجیکٹ کے اوپر ایک جگہ پر لے جائیں جبکہ انگلھ کھلے ہوں۔
2. **اپروچ ٹریجیکٹری**: اپروچ ویکٹر کے ساتھ آگے بڑھیں (عام طور پر گرپ کی سطح سے عمودی)۔
3. **انگلھ بند کرنا**: ٹیکٹائل سینسرز یا موٹر کرنٹ کے ذریعے رابطہ کا پتہ چلنے تک انگلھ بند کریں۔
4. **فورس ریگولیشن**: آبجیکٹ کو کچلنے سے بچنے کے لیے کافی گرپ فورس لگائیں۔
5. **اٹھانے کی تصدیق**: ریسٹ پر فورس/ٹارک کی نگرانی کرکے تصدیق کریں کہ آبجیکٹ پکڑا ہوا ہے۔

گرپ کے معیار کو GWS (گرپ رینچ اسپیس) یا اپسیلون کوالٹی پیمائش جیسے پیمائشوں کا استعمال کرتے ہوئے جانچا جاتا ہے، جو گرپ کی طاقت کو بے قرار کرنے والی زیادہ سے زیادہ رینچ کو ماپتا ہے۔

#### رابطہ ترتیب

ملٹی-کانٹیکٹ مانپلیشن کے لیے (مثلاً، رسائی کرتے وقت میز کے ساتھ ٹیک لگانا)، روبوٹ کو کام کو حاصل کرتے ہوئے بیلنس برقرار رکھنے کے لیے رابطے کو ترتیب دینا ہوتا ہے۔ رابطہ پلانر منتخب کرتا ہے:

- کون سے لنکس ماحول کو چھوئیں گے
- رابطہ کے قیام اور ریلیس کا ترتیب
- ہر رابطے پر لاگی جانے والی طاقتیں

### سوشل روبوٹکس اور پراکسیمکس

#### پراکسیمکس زونز

پراکسیمکس انسان-انسان انٹریکشن کے لیے چار مکانی زونز متعین کرتا ہے، جو براہ راست انسان-روبوٹ انٹریکشن پر لاگو ہوتے ہیں:

| زون | فاصلہ | روبوٹس کے لیے استعمال |
|---|---|---|
| ذاتی | 0-0.45 m | طبی روبوٹس، معاونت کی نگہبانی |
| ذاتی | 0.45-1.2 m | تعاونی مانپلیشن، ہینڈ اوور |
| سماجی | 1.2-3.6 m | خدماتی روبوٹس، استقبال، سلام |
| عوامی | >3.6 m | گودام، گشت، ڈلیوری |

#### وضاحت پذیری اور قابل پیشگوئی

ایک سماجی طور پر مہارت رکھنے والا روبوٹ اپنی نیت کا اظہار کرتا ہے تاکہ انسان یہ بتا سکیں کہ اگلا کیا ہوگا:

- **وضاحت پذیری**: روبوٹ کی حرکت انسان ناظرین کے لیے پڑھنے والی ہونی چاہیے۔ مثلاً، رسائی کی حرکت میں ایک واضح، براہ راست ٹریجیکٹری ہونی چاہیے نہ کہ ایک مبہم متعدد راستہ۔
- **قابل پیشگوئی**: روبوٹ کو دہرائے جانے والے حالات میں مسلسل برتاؤ کرنا چاہیے تاکہ انسان اس کے اقدام کی پیشگوئی کر سکیں۔
- **رفتار پروفائلنگ**: انسان کی طرف تیزی سے بڑھنا جاری محسوس ہو سکتا ہے؛ ایک جھنٹی کی شکل کی رفتار پروفائل زیادہ قدرتی محسوس ہوتی ہے۔

#### نظر اور جیسچر

- **نظر کی سمت**: رسائی سے پہلے آبجیکٹ کی طرف دیکھنا نیت کا اشارہ کرتا ہے۔ انسان کی طرف دیکھنا توجہ یا تصدیق کی درخواست کا اشارہ کرتا ہے۔
- **سر کی سمت**: جسم کی حرکت سے پہلے سر کو اگلی حرکت کی سمت میں موڑنا وضاحت پذیری بہتر بناتا ہے۔
- **جیسچر**: اشارہ کرنے کا جیسچر یا سر ہلانا بغیر گفتگو کے نیت کا اظہار کر سکتا ہے۔
- **ذاتی خانے کا احترام**: روبوٹ کو ذاتی زون میں داخل ہوتے وقت رکنا یا سست ہونا چاہیے تاکہ انسان کو رد عمل دینے کا وقت ملے۔

## ہیومانائڈ روبوٹ کی تفصیلات

درج ذیل جدول میں تعلیمی اور تحقیقی لیبز کے لیے مناسب عام ہیومانائڈ اور لیگڈ پلیٹ فارموں کا موازنہ ہے:

| پلیٹ فارم | قسم | DOF | اونچائی | وزن | کمپیوٹ | ایکچویٹرز | سینسرز | قیمت (تقریبی) |
|---|---|---|---|---|---|---|---|---|
| Unitree G1 | مکمل ہیومانائڈ | 23 | 1.27 m | 35 kg | NVIDIA Orin (up to 100 TOPS) | High-torque electric | RGB-D, lidar, IMU, force/torque | $16,000-$30,000 |
| Unitree H1 | مکمل ہیومانائڈ | 19 | 1.80 m | 47 kg | NVIDIA Orin (up to 100 TOPS) | High-torque electric | RGB-D, lidar, IMU, force/torque | $30,000-$60,000 |
| Unitree Go2 | چوپایا | 12 | 0.34 m | 12 kg | NVIDIA Orin (up to 100 TOPS) | Electric motors | RGB-D, lidar, IMU | $1,600-$3,000 |
| Robotis OP3 | مینی ہیومانائڈ | 20 | 0.50 m | 3.5 kg | Intel NUC or Jetson | Dynamixel servos | Camera, IMU | $5,000-$8,000 |
| Hiwonder TonyPi | تعلیمی ہیومانائڈ | 19 | 0.45 m | 1.8 kg | Raspberry Pi 4B or Jetson Nano | Hiwonder servos | Camera, IMU | $1,200-$2,500 |

### ایکچویٹر کا موازنہ

| پلیٹ فارم | ٹارک (کولہا) | ٹارک (گٹنا) | چوٹی پاور | کنٹرول بینڈوتھ |
|---|---|---|---|---|
| Unitree G1 | ~120 Nm | ~45 Nm | ~200 W | High (custom PMSM) |
| Unitree H1 | ~220 Nm | ~100 Nm | ~400 W | High (custom PMSM) |
| Unitree Go2 | ~30 Nm | ~25 Nm | ~30 W | Medium |
| Robotis OP3 | ~1.5 Nm | ~1.5 Nm | ~3 W | Low (servo) |
| Hiwonder TonyPi | ~0.5 Nm | ~0.5 Nm | ~0.5 W | Low (servo) |

### سافٹویئر اکوسسٹم

| پلیٹ فارم | ROS 2 سپورٹ | Isaac ROS | SLAM | رینفورسمنٹ لرننگ | سیمیولیشن |
|---|---|---|---|---|---|
| Unitree G1/H1 | Full (unitree_ros2) | Yes | Yes | Yes (Isaac Gym) | Isaac Sim, MuJoCo |
| Unitree Go2 | Full (unitree_ros2) | Yes | Yes | Yes (Isaac Gym) | Isaac Sim, MuJoCo |
| Robotis OP3 | Partial (OP3 ROS package) | No | Limited | Limited | Webots, Gazebo |
| Hiwonder TonyPi | Partial (Hiwonder SDK) | No | No | No | Limited |

### مختصر ہیومانائڈ کے لیے URDF مثال

درج ذیل URDF ایک کم از کم ہیومانائڈ کی وضاحت کرتا ہے جس میں ایک دھڑ، دو 3-DOF ٹانگیں، اور ایک سر ہے۔ ہر جوائنٹ ٹارک اور رفتار کی حدود کے ساتھ ایک ریولوٹ ایکچویٹر استعمال کرتا ہے۔

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

### جوائنٹ کنٹرولر کنفیگریشن

درج ذیل ROS 2 YAML کنفیگریشن ایک ہیومانائڈ ٹانگ کے لیے جوائنٹ لیول PD کنٹرولر کی وضاحت کرتی ہے۔ ہر جوائنٹ میں پوزیشن اور رفتار گینز، ٹارک لیمٹس، اور حفاظت کی حدیں ہیں۔

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

### بیلنس کنٹرول الگورتھم

درج ذیل پیسوڈوکوڈ ایک ریئل ٹائم بیلنس کنٹرولر کی وضاحت کرتا ہے جو سنگل سپورٹ فیز کے دوران CoM کو سپورٹ پولیگون سے اوپر برقرار رکھنے کے لیے گھٹنے اور کولہے کے ٹارک کا حساب لگاتا ہے۔

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

### انورس کینی میٹکس کے ساتھ گرپ پلاننگ

درج ذیل مثال ایک گرپ پلاننگ پائپ لائن کی نمائش کرتی ہے جو ایک ہیومانائڈ بازو کے ساتھ کسی آبجیکٹ تک رسائی اور گرپ کرنے کے لیے IK کا استعمال کرتی ہے۔

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

## لیب بجٹ پلاننگ گائیڈ

### ٹیئر 1: صرف سیمیولیشن ($0-$500)

اس ٹیئر کو کوئی فزیکل ہارڈویئر کی ضرورت نہیں۔ ساری سیکھا سیمیولیشن میں ہوتی ہے۔

| آئٹم | لاگت | مقصد |
|---|---|---|
| کلاؤڈ GPU رسائی (Google Colab, AWS) | $0-$200/mo | بھاری سیمیولیشن (Isaac Sim, MuJoCo) |
| موجودہ لیپٹاپ/ڈیسکٹاپ | $0 | ڈیویلپمنٹ ماحول |
| ROS 2 Humble (مفت) | $0 | روبوٹ مڈل ویئر |
| Isaac Sim (مفت ٹیئر) | $0 | GPU تیزی سے سیمیولیشن |
| MuJoCo (مفت) | $0 | فزکس سیمیولیشن |

**یہ ٹیئر کیا سکھاتا ہے**: ROS 2 کی بنیادی باتیں، URDF ماڈلنگ، کینی میٹکس سیمیولیشن، بنیادی کنٹرول الگورتھم، پرپشن پائپ لائن ڈیویلپمنٹ۔

**حدود**: کوئی ریئل ہارڈویئر فرکشن نہیں، کوئی سینسر نوائز نہیں، کوئی بیٹری کنسٹرینٹس نہیں، کوئی حفاظت کے تحفظات نہیں۔

### ٹیئر 2: ایج پرپشن اور پراکسی ($1,500-$5,000)

فزیکل ایج کمپیوٹنگ اور ایک سادہ روبوٹ پلیٹ فارم شامل کرتا ہے۔

| آئٹم | لاگت | مقصد |
|---|---|---|
| NVIDIA Jetson Orin Nano | $250 | ایج AI کمپیوٹ |
| Intel RealSense D435i | $250 | ڈیپتھ کیمرہ |
| Bosch BNO085 IMU | $30 | سمت اور تیزی |
| Unitree Go2 (بیس) | $1,600 | چوپایا لوکو موشن پلیٹ فارم |
| ایکسٹرنل GPU (اختیاری) | $500-$1,000 | تربیت میں تیزی |
| USB کیبلز، ماونٹنگ ہارڈویئر | $50 | انٹیگریشن |

**یہ ٹیئر کیا سکھاتا ہے**: ایج ڈیپلویمنٹ، سینسر فیوژن، SLAM، چوپایا لوکو موشن، ریئل ہارڈویئر پر ROS 2، حفاظت کے پروٹوکل۔

**حدود**: کوئی مانپلیشن نہیں، کوئی ہیومانائڈ کینی میٹکس نہیں، کوئی دو پاؤں کا بیلنس نہیں۔

### ٹیئر 3: ہیoomanائڈ ٹرانسفر ($10,000-$40,000)

مکمل ہیومانائڈ پلیٹ فارم معاون انفراسٹرکچر کے ساتھ۔

| آئٹم | لاگت | مقصد |
|---|---|---|
| NVIDIA Jetson AGX Orin | $2,000 |高性能 ایج کمپیوٹ |
| Intel RealSense D455 | $350 | لمبا فاصلہ ڈیپتھ |
| Unitree G1 (بیس) | $16,000 | ہیoomanائڈ پلیٹ فارم |
| RTX 4070+ ورک اسٹیشن | $2,000 | سیمیولیشن اور تربیت |
| فورس/ٹارک سینسرز (x2) | $1,000 | مانپلیشن فیڈبیک |
| حفاظتی جال / ٹیدر | $200 | گرنے سے حفاظت |
| اضافی ایکچویٹرز اور کیبلز | $500 | دیکھ بھال |

**یہ ٹیئر کیا سکھاتا ہے**: دو پاؤں کی لوکو موشن، مجموعی کنٹرول، مانپلیشن، ریئل ہارڈویئر پر IK، انسان-روبوٹ انٹریکشن، ڈیپلویمنٹ ورک فلو۔

**حدود**: زیادہ حفاظت کا بوجھ، محدود بیٹری لائف، تربیت یافتہ آپریٹرز کی ضرورت۔

### بجٹ بہترین کارکردگی کے تجاویز

1. **سیمیولیشن سے شروع کریں**: ہارڈویئر خریدنے سے پہلے 2-3 مہینے سیمیولیشن میں سرمایہ کاری کریں۔ زیادہ تر کنٹرول الگورتھم سیمیولیشن میں تصدیق کیے جا سکتے ہیں۔
2. **استعمال شدہ یا ریفربش خریدیں**: Unitree اور Robotis پلیٹ فارمز کبھی کبھی 30-50% چھوٹ پر ریفربش یونٹس پیش کرتے ہیں۔
3. **لیبز کے درمیان شیئر کریں**: ایک واحد ہیoomanائڈ پلیٹ فارم 3-4 طالب علم گروپس کی خدمت کر سکتا ہے فی سیمسٹر شیڈولڈ لیب سیشنز کے ساتھ۔
4. **اوپن سورس کا فائدہ اٹھائیں**: ROS 2، Isaac ROS، اور MuJoCo مفت ہیں۔ زیادہ تر ہیoomanائڈ کنٹرول الگورتھم کوڈ کے ساتھ شائع کیے جاتے ہیں۔
5. **ہارڈویئر حاصل کرنے کا مرحلہ بندی کریں**: ٹیئر 1 سے شروع کریں، داخلے میں اضافے کے ساتھ ٹیئر 2 کے اجزاء شامل کریں، اور صرف تحقیقی output اس کی وجہ بنائے تو ٹیئر 3 میں سرمایہ کاری کریں۔

## روبوٹ لیب کے اختیارات

| اختیار | کس لیے بہترین | تبادلہ | مطلوبہ کمپیوٹ | حفاظت کی سطح |
|---|---|---|---|---|
| صرف سیمیولیشن | ابتدائی سیکھنا، حفاظت، کم لاگت | کوئی ریئل ہارڈویئر فرکشن نہیں | کوئی بھی CPU/GPU | کوئی نہیں |
| سینسرز کے ساتھ ایج کٹ | پرپشن اور ڈیپلویمنٹ مشق | کوئی مکمل جسمانی حرکت نہیں | Jetson یا اس کے مترادف | کم |
| پراکسی روبوٹ یا بازو | ROS 2، نیویگیشن، مانپلیشن مشق | حقیقی ہیoomanائڈ نہیں | Jetson یا NUC | کم-درمیانہ |
| مینی ہیoomanائڈ | چلنے اور کینی میٹکس کی نمائش | محدود کمپیوٹ اور پیلوڈ | NUC یا Jetson | درمیانہ |
| پریمیم ہیoomanائڈ | ریئل ہیoomanائڈ کیپسٹون ریسرچ | زیادہ لاگت اور حفاظت کا بوجھ | Jetson AGX + RTX | زیادہ |

## مینی کیس اسٹڈی: بجٹ کا راستہ منتخب کرنا

اگر کلاس RTX ورک اسٹیشنز یا مکمل ہیoomanائڈ تک رسائی نہیں رکھتی، تو یہ ابھی بھی اسٹیجڈ لیب کے ذریعے فزیکل AI سیکھ سکتی ہے:

1. بھاری سیمیولیشن کے لیے کلاؤڈ یا مشترکہ GPU رسائی استعمال کریں۔ Google Colab Pro ($50/mo) Isaac Sim اور PyTorch تربیت کے لیے NVIDIA T4 GPUs تک رسائی فراہم کرتا ہے۔
2. ایج انفرنس اور ڈیپلویمنٹ کنسٹرینٹس کے لیے Jetson کٹس استعمال کریں۔ Jetson Orin Nano ($250) ROS 2 چلاتا ہے اور RealSense ڈیپT data کو 30 FPS پر پروسیس کر سکتا ہے۔
3. پرپشن لیبز کے لیے RealSense کیمرے اور IMUs استعمال کریں۔ D435i ($250) وژوال-انرٹیل ایڈومیٹری کے لیے مطابقت پذیر رنگ، ڈیپتھ، اور IMU ڈیٹا فراہم کرتا ہے۔
4. محفوظ فزیکل نمائشوں کے لیے پراکسی روبوٹ یا روبوٹک بازو استعمال کریں۔ Unitree Go2 ($1,600) ہیoomanائڈ بیلنس کی پیچیدگی کے بغیر لوکو موشن کے اصولوں کی نمائش کرتا ہے۔
5. حفاظت اور بجٹ کو ریئل ہارڈویئر کی اجازت تک ورچوئل ہیoomanائڈ کیپسٹون کو سیمیولیشن میں رکھیں۔ Isaac Sim میں ایک ورچوئل Unitree G1 مکمل کنٹرول اسٹیک چلا سکتا ہے۔

## عملی لیب

<div className="lab-box">
<h3>لیب: روبوٹکس لیب ڈیزائن کریں</h3>
<p>تین ٹیئرز کے ساتھ ایک لیب خریداری کا منصوبہ بنائیں: کم از کم، تجویز کردہ، اور پریمیم۔ ورک اسٹیشن، ایج کٹ، سینسرز، اور روبوٹ پلیٹ فارم شامل کریں۔ وضاحت کریں کہ ہر ٹیئر کیا سکھا سکتا ہے۔</p>

**ڈلیوریبلز**:

1. ہر ٹیئر کے لیے آئٹم وائز لاگت کے ساتھ ایک اسپریڈ شیٹ
2. ہر ٹیئر کے لیے سیکھنے کے نتائج کی وضاحت کرتے ہوئے ایک صفحہ کا جواز
3. پریمیم ٹیئر کے لیے ایک خطرے کا جائزہ (حفاظت کے پروٹوکل، مطلوبہ تربیت)
4. ایک سیمسٹر شیڈول جو دکھاتا ہے کہ نصاب میں ہر ٹیئر کب استعمال ہوگا

**جائزے کے معیارات**:

- لاگت کی درستگی (موجودہ لسٹنگز کے خلاف قیمتیں کی تصدیق کریں)
- سیکھنے کے نتائج کا انطاں (ہر آئٹم کو مخصوص کورس کے مقاصد سے نقشہ بندی کریں)
- حفاظت کی مکملیت (تمام خطرات اور تخفیف کی حکمت عملیوں کی شناخت کریں)
- قابل عمل (کیا منصوبہ محکمہ کے بجٹ سائیکل کے اندر نافذ کیا جا سکتا ہے؟)
</div>

## کوئز

### اپنی سمجھ کی جانچ کریں

1. کیوں ہیoomanائڈ چہرے والے روبوٹس سے کنٹرول کرنا مشکل تر ہے؟
2. زیرو مومنٹ پوائنٹ کیا ہے، اور یہ بیلنس کے لیے کیوں اہم ہے؟
3. کیپچر پوائنٹ ZMP سے کیسے مختلف ہے؟
4. مانپلیشن کے لیے امپڈنس کنٹرول کا پوزیشن کنٹرول کے لیے بنیادی فائدہ کیا ہے؟
5. چار پراکسیمکس زونز کیا ہیں، اور کون سا زون ایک روبوٹ کو انسان کو کپ دینے پر لاگو ہوتا ہے؟
6. دو وجوہ بتائیں کہ کیوں ایک مکمل ہیoomanائڈ ایک ہی کمپیوٹ والی چوپایا سے زیادہ مہنگا ہے۔
7. کیوں دو پاؤں کی سیڑھی چڑھنے کو ہموار زمین پر چلنے سے زیادہ جوائنٹ ٹارک کی ضرورت ہوتی ہے؟
8. ڈیمپڈ لیسٹ اسکوائرز طریقہ کیا ہے، اور یہ IK میں کیوں استعمال ہوتا ہے؟
9. لکیری الٹے پینڈولم ماڈل دو پاؤں کی گیٹ پلاننگ کو کیسے آسان بناتا ہے؟
10. ایک اسٹیجڈ لیب حکمت عملی میں، آپ کو ایک وقت میں صرف ایک نیا خطرے کی سطح کیوں شامل کرنا چاہیے؟

### جوابات کی کلید

1. انہیں چھوٹے سپورٹ پولیگون پر م.dynamic balance کا انتظام کرنا ہوتا ہے، 20+ ٹائے گئے جوائنٹس کو کوآرڈینیٹ کرنا ہوتا ہے، ہائبرڈ رابطہ عبور کو سنبھالنا ہوتا ہے، اور ایک ساتھ مانپلیشن کرنا ہوتا ہے۔ چہرے والے روبوٹس کا ایک مستحکم بیس ہوتا ہے اور بہت کم DOF ہوتے ہیں۔
2. ZMP وہ پوائنٹ ہے جہاں زمین کی رد عمل کی طاقتوں کا مجموعہ افقی محوروں کے بارے میں صفر ہوتا ہے۔ اگر ZMP سپورٹ پولیگون کے اندر ہے، تو روبوٹ اسٹیٹک طور پر مستحکم ہے۔ اگر یہ باہر ہے، تو روبوٹ الٹ جائے گا۔
3. ZMP موجودہ توازن کی نشاندہی کرتا ہے؛ کیپچر پوائنٹ نشاندہی کرتا ہے کہ روبوٹ کو رکنے کے لیے اگلا پاؤں کا قدم کہاں رکنا چاہیے۔ کیپچر پوائنٹ ZMP تجزیے کو متحرک، کئی قدم والی چال میں بڑھاتا ہے۔
4. امپڈنس کنٹرول پوزیشن ایرر اور انٹریکشن فورس کے درمیان تعلق کو منظم کرتا ہے، جو آبجیکٹس کے ساتھ لچکدار رابطے کی اجازت دیتا ہے۔ پوزیشن کنٹرول رابطہ کی طاقتیں کی پرواہ کیے بغیر盲目 طور پر ٹارگت تک پہنچنے کی کوشش کرتا ہے، جو آبجیکٹ یا روبوٹ کو نقصان پہنچا سکتا ہے۔
5. ذاتی (0-0.45 m)، ذاتی (0.45-1.2 m)، سماجی (1.2-3.6 m)، عوامی (>3.6 m)۔ کپ دینا ذاتی زون میں ہوتا ہے۔
6. ہیoomanائڈ کو 6 DOF والی دو پاؤں والی ٹانگیں چاہییں (بیلنس اور زمین کے ڈھانچے کے لیے)، کھڑے تینانے کے لیے بھاری دھڑ، اور زیادہ پیچیدہ مجموعی کنٹرولرز۔ چوپایا کا فطری طور پر مستحکم چار نقطہ بیس ہوتا ہے۔
7. ہر قدم میں CoM کو رائザー کی اونچائی تک اٹھنا ہوتا ہے، جس کے لیے گریویٹی کے خلاف مسلسل کولہے اور گٹنے کی توسیع کی ضرورت ہوتی ہے۔ اس کے علاوہ، ہرنگ ٹانگ کو رائザー سے صاف ہونے کے لیے کافی اونچا اٹھنا ہوتا ہے، جو ٹارک کی تقاضا میں اضافہ کرتا ہے۔
8. یہ IK حل کو $\Delta \mathbf\{q\} = J^T (J J^T + \lambda^2 I)^\{-1\} \Delta \mathbf\{x\}$ کے طور پر حساب لگاتا ہے، جو سنگولریٹیز کے قریب بیماری سے بچاتا ہے ڈیمپنگ ٹرم $\lambda^2 I$ کو ہٹائے جانے والے میٹرکس میں شامل کرکے۔
9. LIPM مستقل CoM اونچائی فرض کرتا ہے اور افقی ڈائنامکس کو دو آزاد لکیری مساوات میں علیحدہ کرتا ہے، جو موثر گیٹ بنانے کے لیے پیشگوئی کنٹرول اور MPC فراہم کرتا ہے۔
10. ہر نیا سبسسٹم (سینسرز، ایکچویٹرز، کمیونیکیشن، خودمختاری) ممکنہ ناکامی کے طریقے متعارف کراتا ہے۔ ایک وقت میں ایک شامل کرنا جدائی اور ڈیبگنگ کی اجازت دیتا ہے بغیر ٹیم کو ایک ساتھ غیر معلوم چیزوں سے دبائے۔

## لغت

| اصطلاح | تعریف |
|---|---|
| **Bipedal locomotion** | دو پاؤں پر چلنا، جس کے لیے مسلسل م.dynamic balance کا انتظام ضروری ہے |
| **Capture point (CP)** | وہ پوائنٹ جہاں ایک پاؤں کا قدم روبوٹ کو مکمل طور پر رک دے |
| **Center of mass (CoM)** | روبوٹ میں تمام لنکس کی ماس وزنی اوسط پوزیشن |
| **Denavit-Hartenberg (DH) parameters** | چار پیرامیٹرز (a, alpha, d, theta) جو ہر جوائنٹ-لنک پیر کی جیومٹری بیان کرتے ہیں |
| **Degrees of freedom (DOF)** | روبوٹ کی کنفیگریشن کو مکمل طور پر بیان کرنے کے لیے ضروری آزاد متغیرات کی تعداد |
| **Dynamixel servo** | تعلیمی اور تحقیقی روبوٹس میں عام طور پر استعمال ہونے والی اسمارٹ ایکچویٹرز کی لائن |
| **Epsilon quality** | گرپ میٹرکس کے کم از کم سنگولر ویلیو پر مبنی گرپ کوالٹی پیمائش |
| **Forward kinematics (FK)** | جوائنٹ کونوں سے اینڈ ایفیکٹر کی پوزیشن اور آریئنٹیشن کا حساب |
| **Gait cycle** | تمام ٹانگوں کے لیے ناپہنے اور ہرنگ فیز کا ایک مکمل سیکل |
| **Grasp wrench space (GWS)** | تمام رینچز کا مجموعہ جو ایک گرپ کا مقابلہ کر سکتا ہے |
| **Homogeneous transformation** | 4x4 میٹرکس جو ایک آپریشن میں رولیشن اور ٹرانسلیشن کی نمائندگی کرتا ہے |
| **Impedance control** | ایک کنٹرول حکمت عملی جو پوزیشن ایرر اور انٹریکشن فورس کے درمیان م.dynamic تعلق کو منظم کرتی ہے |
| **Inverse kinematics (IK)** | مطلوبہ اینڈ ایفیکٹر پوز حاصل کرنے کے لیے جوائنٹ کونوں کا حساب |
| **Jacobian** | جوائنٹ رفتاروں کو اینڈ ایفیکٹر رفتاروں سے جوڑنے والا میٹرکس |
| **Legibility** | روبوٹ کی حرکت کی حد جس میں انسان ناظرین اسے پڑھ اور سمجھ سکتے ہیں |
| **Linear inverted pendulum model (LIPM)** | دو پاؤں کی چال کے تجزیے کے لیے مستقل CoM اونچائی فرض کرنے والا ایک آسان م.dynamic ماڈل |
| **Model predictive control (MPC)** | ایک بہترین پر مبنی کنٹرول طریقہ جو مستقبل کی حالتوں کا اندازہ لگاتا ہے اور محدود افق پر اقدامات کو بہتر بناتا ہے |
| **Operational-space control** | انفرادی جوائنٹ ٹارکس کے بجائے براہ راست اینڈ ایفیکٹر فورسز اور ٹارکس کا کنٹرول |
| **Proxemics** | انسانوں کی جگہ کے استعمال اور ذاتی فاصلے کے انٹریکشن پر اثرات کا مطالعہ |
| **Quadratic program (QP)** | کواڈراٹک مقصد اور لکیری پابندیوں والا ایک بہترین مسئلہ، مجموعی کنٹرول میں استعمال ہوتا ہے |
| **SLAM** | Simultaneous Localization and Mapping: نقشہ بناتے ہوئے روبوٹ کو اس کے اندر مقامی بنانا |
| **Spring-mass model** | ٹانگ کو اسپرنگ اور جسم کو پوائنٹ ماس سمجھ کر ایک آسان بھاگنے کا ماڈل |
| **Support polygon** | تمام زمین رابطہ پوائنٹس کا محدب محیط؛ اسٹیٹک توازن کے لیے CoM پراجیکشن اس کے اندر رہنا چاہیے |
| **URDF** | Unified Robot Description Format: روبوٹ کینی میٹکس، ڈائنامکس، اور بصری ظاہری شکل بیان کرنے کا ایک XML معیار |
| **Whole-body control** | مطلوبہ اینڈ ایفیکٹر فورسز حاصل کرتے ہوئے بیلنس برقرار رکھتے ہوئے تمام جوائنٹس کو ایک ساتھ کوآرڈینیٹ کرنا |
| **Zero moment point (ZMP)** | وہ پوائنٹ جہاں زمین کی رد عمل کی طاقتوں کا مجموعہ افقی محوروں کے بارے میں صفر ہوتا ہے |

## حفاظت اور ہارڈویئر نوٹس

<div className="safety-box">
<h3>ہارڈویئر اسکیلیشن پروٹوکل</h3>
<p>سیمیولیشن سے ایج کٹس سے پراکسی روبوٹس تک جائیں مکمل ہیoomanائڈ حرکت سے پہلے۔ ہر قدم کو ایک وقت میں صرف ایک نیا خطرے کی سطح شامل کرنا چاہیے۔</p>

**ٹیئرز کے لیے مطلوبہ حفاظتی تدابیر**:

- **ٹیئر 1 (سیمیولیشن)**: معیاری کمپیوٹر حفاظت۔ کوئی مخصوص تربیت کی ضرورت نہیں۔
- **ٹیئر 2 (ایج + پراکسی)**: اسٹاپ بٹن، چوپایا کے لیے ٹیدر، نگرانی والی آپریشن، ایکچویٹرز کے قریب کوئی ڈھیلے کپڑے نہیں۔
- **ٹیئر 3 (ہیoomanائڈ)**: ہارڈ ہیٹ زون، حفاظتی جال یا اوور ہیڈ ٹیدر، دو شخص آپریشن (سپاٹر + آپریٹر)، پہنچ کے اندر ایمرجنسی اسٹاپ، بیٹری ڈسکنیکٹ پروٹوکل، ہر سیشن سے پہلے پری-فلائٹ چیک لسٹ، حادثے کی رپورٹنگ فارم۔

**دیکھ بھال کا شیڈول**:

- ہر لیب سیشن سے پہلے ایکچویٹر کیبلز اور کنیکٹرز کا جائزہ لیں
- ہر مہینے بیٹری کی صحت کو چیک کریں (وولٹیج، صلاحیت، اندرونی مزاحمت)
- تین ماہ میں ایک بار فرم ویئر اور ROS 2 پیکجز اپ ڈیٹ کریں
- ضرورت کے مطابق پرانے پاؤں کے پیڈز اور ربڑ کے اجزاء تبدیل کریں
- تمام ہارڈویئر حادثات کو ایک مشترکہ لاگ میں دستراست کریں
</div>

## مزید مطالعہ

- Kajita, S., et al. *Introduction to Humanoid Robotics*. Springer, 2015.
- Siciliano, B., and Khatib, O. *Springer Handbook of Robotics*. Springer, 2016.
- Walking pattern generation: Kajita, S., et al. "Biped walking pattern generation by using preview control of zero-moment point." ICRA 2003.
- Capture point: Pratt, J., et al. "Capture point: A step toward humanoid push recovery." Humanoids 2006.
- Impedance control: Hogan, N. "Impedance control: An approach to manipulation." ASME J. Dynamic Systems, 1985.
- Proxemics: Hall, E.T. *The Hidden Dimension*. Doubleday, 1966.
- Unitree documentation: https://www.unitree.com
- ROS 2 Humble docs: https://docs.ros.org/en/humble/
