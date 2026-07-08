// Preventative measures & everyday self-care guidance for people living with HHT.
// This content is educational and supportive in nature. It is drawn from published
// HHT guidelines and patient resources (Cure HHT / International HHT Guidelines,
// St. Michael's Hospital, peer-reviewed literature) but it is NOT medical advice.

export const preventionDisclaimer =
  "This is friendly, general self-care guidance gathered from HHT research and patient resources — it's here to support you between appointments, not replace your HHT specialist. Always check new habits, supplements, or products with your care team first.";

export const preventionCategories = [
  {
    id: "nasal-care",
    icon: "💧",
    title: "Nose & Nosebleed Care",
    summary: "Keeping the inside of your nose moist and undisturbed is the single biggest thing you can do day-to-day.",
    tips: [
      {
        title: "Moisturize twice a day, every day",
        body: "Nosebleeds in HHT usually start because the nasal lining gets dry and cracks. Using a nasal moisturizer (saline gel, saline spray, or an oil-based emollient) morning and night — even on good days — is the first-line, most evidence-backed habit for reducing nosebleeds.",
        tag: "Daily",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Ponaris and sesame/rose-geranium oil are reasonable options",
        body: "Ponaris nasal emollient (a blend of botanical oils) and compounded sesame/rose geranium oil have both shown improvement in nosebleed severity scores in HHT studies. A couple of drops in each nostril in the morning is a common routine — ask your ENT if one of these fits your case.",
        tag: "Daily",
        src: "Reh, Hur & Merlo, Laryngoscope 2013; Southwest ENT patient handout"
      },
      {
        title: "About Aquaphor / petroleum jelly — use sparingly, know the trade-off",
        body: "Petroleum-based ointments like Aquaphor or Vaseline do coat and moisturize the nose, and some HHT patients use them. But because petroleum products aren't absorbed by the body, small amounts swallowed toward the back of the nose over months/years have — rarely — been linked to a lung irritation called lipoid pneumonia. Water- or oil-based options (saline gel, Ponaris) are generally preferred for regular long-term use; if you do use a petroleum ointment, use a thin layer and mention it at your next check-up.",
        tag: "Know the trade-offs",
        src: "Mayo Clinic; Sautter & Smith, Otolaryngol Clin N Am 2016"
      },
      {
        title: "Run a humidifier while you sleep",
        body: "Dry indoor air — especially from heating or air conditioning — dries out the nasal lining overnight. A clean humidifier in the bedroom, keeping room humidity around 40–60%, is a simple, low-cost habit that many HHT patients find helpful.",
        tag: "Nightly",
        src: "Mayo Clinic; patient-reported HHT lifestyle habits"
      },
      {
        title: "Hands off — avoid picking, rubbing, or forceful blowing",
        body: "The fragile blood vessels (telangiectasias) inside an HHT nose sit close to the surface. Picking, vigorous rubbing, or forceful nose-blowing is one of the most common triggers for a bleed. Blow gently, one nostril at a time, and keep fingernails away from the inside of the nose.",
        tag: "Always",
        src: "Cure HHT Nosebleed Care Checklist"
      },
      {
        title: "Rinse with saline carefully, not aggressively",
        body: "Saline nasal rinses can help clear crusting and add moisture, but they should be done gently — a forceful squeeze bottle or high-pressure irrigation can itself trigger a bleed in some people. Low, gentle pressure is safer than high-flow devices.",
        tag: "As needed",
        src: "Sautter & Smith, Otolaryngol Clin N Am 2016"
      },
      {
        title: "Protect your nose in dry, hot, or high-altitude environments",
        body: "Air travel, heated cars, dry climates, and high altitude all dry out the nose faster. Pack your nasal moisturizer in your bag (not checked luggage) and reapply more often on travel days or during dry seasons.",
        tag: "Situational",
        src: "Cure HHT patient guidance"
      },
      {
        title: "Know your at-home nosebleed plan",
        body: "Sit upright (don't tilt your head back), lean slightly forward, and pinch the soft lower part of your nose firmly for a full 10–15 minutes without checking. Have your bleeding plan and supplies (gauze, nasal moisturizer, a mirror) somewhere easy to grab.",
        tag: "Emergency-ready",
        src: "Cure HHT 'My Nosebleed Care Checklist'"
      },
      {
        title: "Avoid contact sports or activities with high face/nose injury risk",
        body: "A blow to the nose can tear fragile vessels and cause a severe bleed. If you enjoy sports, ask your specialist about safer alternatives or protective gear for your face.",
        tag: "Lifestyle",
        src: "Cure HHT patient guidance"
      }
    ]
  },
  {
    id: "diet-nutrition",
    icon: "🥗",
    title: "Diet & Nutrition",
    summary: "What you eat can gently turn nosebleed risk up or down — small, sustainable swaps matter more than strict rules.",
    tips: [
      {
        title: "Go easy on salt",
        body: "High-sodium meals can raise blood pressure, and higher blood pressure can make nosebleeds more frequent or harder to stop. Cooking more at home, tasting before adding salt, and watching processed/packaged foods are practical ways to cut back.",
        tag: "Daily habit",
        src: "General hypertension research; patient-reported HHT dietary practice"
      },
      {
        title: "Rich, heavy spice blends (masala) in moderation",
        body: "Spicy food itself doesn't thin your blood, but very hot/spicy meals can dilate blood vessels and increase blood flow to the nose and face — for some people, that seems to bring on a nosebleed. It affects everyone differently; if you notice a pattern after a spicy meal, it's reasonable to dial back the heat, not cut out flavor.",
        tag: "Notice your pattern",
        src: "Silva, Hosman & Devlin et al., Laryngoscope 2013"
      },
      {
        title: "Alcohol — the most commonly reported trigger",
        body: "In the largest HHT lifestyle survey to date, alcohol was the single most frequently volunteered dietary trigger for nosebleeds. It widens blood vessels and can interfere with clotting. You don't have to eliminate it, but keeping intake light and noticing your own response is worthwhile.",
        tag: "Notice your pattern",
        src: "Silva, Hosman & Devlin et al., Laryngoscope 2013"
      },
      {
        title: "Be cautious with 'natural blood thinners'",
        body: "High-dose fish oil supplements (over ~3g/day of EPA/DHA), raw garlic in large amounts (more than 1–2 cloves/day), ginkgo biloba, ginseng, and raw ginger in supplement form can all reduce your blood's ability to clot. Cooked garlic and cooked ginger in normal food amounts are considered safe.",
        tag: "Supplements",
        src: "St. Michael's Hospital 'Dietary Choices that may impact Bleeding'"
      },
      {
        title: "Fatty fish is fine in food-sized portions",
        body: "Salmon, sardines, and mackerel are healthy and provide iron and omega-3s — 2–3 servings a week as food is generally considered safe. It's concentrated fish-oil pills or liquid supplements at high doses that carry the bleeding-risk concern.",
        tag: "Everyday food",
        src: "St. Michael's Hospital 'Dietary Choices that may impact Bleeding'"
      },
      {
        title: "Build meals around iron-rich foods",
        body: "Because HHT causes ongoing small blood loss, replenishing iron through food helps: red meat, poultry, fish, beans, lentils, spinach, and iron-fortified cereals are all good everyday sources.",
        tag: "Daily habit",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Pair iron with vitamin C",
        body: "Vitamin C helps your body absorb non-heme (plant-based) iron more efficiently. A glass of citrus juice, some bell pepper, or strawberries alongside an iron-rich meal can help your iron levels stick.",
        tag: "Daily habit",
        src: "Iron deficiency anemia clinical nutrition guidance"
      },
      {
        title: "Some patients find berries, greens, and legumes soothing",
        body: "In patient surveys, blueberries and other red fruits, green vegetables, and legumes were commonly reported as foods that seemed to help rather than worsen nosebleeds — alongside their iron and nutrient value.",
        tag: "Try it",
        src: "Dietary iron intake and anemia in HHT, food-frequency questionnaire study"
      }
    ]
  },
  {
    id: "iron-anemia",
    icon: "🩸",
    title: "Iron & Anemia Management",
    summary: "Chronic small blood loss adds up — staying ahead of iron deficiency protects your energy and your heart.",
    tips: [
      {
        title: "Get your levels checked at least once a year",
        body: "Guidelines recommend an annual complete blood count, ferritin, and iron panel for HHT patients — more often if you're bleeding more, feeling unusually tired, or being treated for anemia.",
        tag: "Yearly",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Take oral iron consistently if prescribed",
        body: "If your doctor has you on an iron supplement, taking it as directed (often once daily, or every other day, which some people tolerate better) for the full course — usually 3+ months after your levels normalize — helps fully rebuild your iron stores, not just your hemoglobin.",
        tag: "As prescribed",
        src: "AGA / iron deficiency anemia clinical guidelines"
      },
      {
        title: "Don't self-treat significant anemia with diet alone",
        body: "Food helps, but if your bleeding is frequent, diet usually can't keep up with the loss. IV iron is a safe, effective option when oral iron isn't tolerated or isn't working — this is a conversation for your hematologist or HHT center, not something to manage solo.",
        tag: "Talk to your team",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Watch for anemia symptoms, not just nosebleed frequency",
        body: "Fatigue, shortness of breath, dizziness, pale skin, or a racing heartbeat can signal your iron is low even if your nosebleeds feel 'normal' for you. These are worth mentioning at your next visit.",
        tag: "Self-check",
        src: "Cure HHT patient education"
      },
      {
        title: "Take iron supplements with vitamin C, away from calcium",
        body: "Vitamin C (600–1200mg) can boost absorption of iron salts, while calcium-rich foods or supplements taken at the same time can reduce how much iron your body absorbs. Spacing them out a few hours can help.",
        tag: "Daily habit",
        src: "AGA iron deficiency anemia clinical guidance"
      },
      {
        title: "Iron deficiency can show up before you feel 'sick'",
        body: "Because HHT bleeding is often slow and repeated rather than one big event, your body can adapt gradually — meaning you might feel 'used to' fatigue that is actually treatable anemia. Regular labs catch this earlier than symptoms do.",
        tag: "Awareness",
        src: "Sautter & Smith, Otolaryngol Clin N Am 2016"
      }
    ]
  },
  {
    id: "medication-safety",
    icon: "💊",
    title: "Medication Safety",
    summary: "Some very common medicines make bleeding more likely — always loop in your care team before starting something new.",
    tips: [
      {
        title: "NSAIDs (ibuprofen, naproxen) need caution",
        body: "Common pain relievers like ibuprofen and naproxen reduce your platelets' ability to clump together, which can worsen bleeding. Acetaminophen (paracetamol) is usually the safer everyday choice for pain — but check with your doctor for your specific situation.",
        tag: "Discuss with doctor",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Aspirin and other blood thinners are a team decision, not a solo one",
        body: "If you're on aspirin, warfarin, or another anticoagulant for a heart or stroke condition, don't stop it on your own — but do make sure your HHT specialist and prescribing doctor are talking to each other about your bleeding risk.",
        tag: "Discuss with doctor",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Mention every supplement at every appointment",
        body: "Fish oil, vitamin E, ginkgo, ginseng, and high-dose garlic supplements can all thin the blood — and they're easy to forget to mention because they feel like 'just vitamins.' Bring your full supplement list to appointments.",
        tag: "Every visit",
        src: "St. Michael's Hospital 'Dietary Choices that may impact Bleeding'"
      },
      {
        title: "Ask before dental work or surgery",
        body: "If you have (or haven't yet been screened for) a lung AVM, you may need antibiotics before dental cleanings or procedures to prevent bacteria from reaching the brain through the bloodstream. This is a well-established precaution — always mention your HHT to any new provider.",
        tag: "Before procedures",
        src: "Cure HHT; British Dental Journal 2008"
      },
      {
        title: "New medication? Ask 'does this affect bleeding or clotting?'",
        body: "Beyond NSAIDs and anticoagulants, some antidepressants (SSRIs) and other medications can mildly affect bleeding risk. It's always reasonable to ask a pharmacist or doctor this one question when starting something new.",
        tag: "Good habit",
        src: "General clinical pharmacology guidance"
      }
    ]
  },
  {
    id: "activity-environment",
    icon: "🌍",
    title: "Activity & Environment",
    summary: "Lung AVMs change the risk calculus for a few specific activities — most of daily life is unaffected.",
    tips: [
      {
        title: "Get screened for lung AVMs — it changes your risk profile",
        body: "All HHT patients should be screened for pulmonary AVMs (usually with a bubble/contrast echocardiogram). Knowing whether you have one determines whether precautions like diving restrictions or antibiotic prophylaxis apply to you.",
        tag: "Foundational",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Avoid scuba diving if you have an untreated lung AVM",
        body: "A lung AVM lets blood bypass your lungs' natural filtering, which raises the risk of complications from the pressure changes and bubbles involved in diving. This precaution goes away once a significant AVM has been treated (embolized).",
        tag: "If you have a PAVM",
        src: "UCLA Health HHT program; Cure HHT Pulmonary AVM guidance"
      },
      {
        title: "Flying is generally fine — but mention lung AVMs to your doctor first",
        body: "Cabin pressure in flight is lower than at sea level, which can matter more if you have a significant untreated lung AVM affecting your oxygen levels. Most people with HHT fly without issue; if you have a known PAVM, a quick pre-trip check-in with your specialist is a sensible habit.",
        tag: "Before travel",
        src: "General aviation medicine guidance; Cure HHT patient resources"
      },
      {
        title: "Keep up with routine dental hygiene",
        body: "Good oral health lowers the amount of bacteria that could enter your bloodstream — important because that bacteria can travel straight to the brain through an untreated lung AVM. Regular brushing, flossing, and cleanings matter more for HHT patients than most people realize.",
        tag: "Ongoing",
        src: "Cure HHT Oral Health Guide for HHT Patients"
      },
      {
        title: "Tell every new doctor or dentist about your HHT",
        body: "Because HHT affects anesthesia planning, antibiotic needs, and bleeding risk, it's worth keeping a simple card or note in your phone summarizing your HHT status, any known AVMs, and your specialist's contact information.",
        tag: "Always",
        src: "Cure HHT patient guidance"
      },
      {
        title: "Humidify your home, especially bedrooms",
        body: "Beyond nosebleed prevention, keeping indoor humidity around 40–60% supports overall respiratory comfort — useful if you also manage a lung AVM or sinus sensitivity.",
        tag: "Home habit",
        src: "Mayo Clinic humidifier guidance"
      }
    ]
  },
  {
    id: "screening-checkups",
    icon: "🩺",
    title: "Screening & Check-ups",
    summary: "The best prevention for the serious, silent complications of HHT is simply staying on your screening schedule.",
    tips: [
      {
        title: "Brain MRI at diagnosis",
        body: "A contrast brain MRI is recommended once at the time of HHT diagnosis (or in childhood) to check for brain vascular malformations, which usually cause no symptoms until they bleed.",
        tag: "Once, then as advised",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Lung AVM screening, then repeat every 5–10 years",
        body: "A bubble/contrast echocardiogram checks for pulmonary AVMs. Because they can grow or new ones can form over time, guidelines recommend rescreening roughly every 5–10 years, or sooner if you're pregnant or symptomatic.",
        tag: "Every 5–10 years",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Annual bloodwork after your mid-30s (or sooner)",
        body: "Yearly hemoglobin/hematocrit and iron studies are recommended for adults with HHT to catch anemia early, before it affects your energy or heart.",
        tag: "Yearly",
        src: "Sautter & Smith, Otolaryngol Clin N Am 2016"
      },
      {
        title: "GI evaluation if anemia doesn't match your nosebleeds",
        body: "If your iron levels are dropping faster than your nosebleeds would explain, your doctor may recommend a GI endoscopy to check for bleeding from telangiectasias in the stomach or intestines — this becomes more relevant after age 50.",
        tag: "As needed",
        src: "Sautter & Smith, Otolaryngol Clin N Am 2016"
      },
      {
        title: "Liver imaging isn't routine, but mention new symptoms",
        body: "Liver vascular malformations are common in HHT but usually silent. Routine liver screening isn't universally recommended, but new symptoms like abdominal pain, swelling, or unusual fatigue are worth raising, especially after 50.",
        tag: "Symptom-driven",
        src: "Cure HHT Screening Guidelines"
      },
      {
        title: "Genetic testing helps the whole family plan",
        body: "If your specific gene mutation is known, testing at-risk relatives (including children) can identify who needs screening and who can be reassured — even before symptoms appear.",
        tag: "Family planning",
        src: "International HHT Guidelines (Ann Intern Med, 2020)"
      },
      {
        title: "Find (or stay connected to) an HHT Center of Excellence",
        body: "Centers with HHT specialists coordinate the whole screening picture — nose, lungs, brain, liver, GI — in one place, which is hard to replicate with separate individual specialists.",
        tag: "Foundational",
        src: "Cure HHT Centers of Excellence network"
      }
    ]
  },
  {
    id: "emotional-wellbeing",
    icon: "💛",
    title: "Emotional Well-being",
    summary: "Living with an unpredictable chronic condition is genuinely hard on its own — your mental health is part of your HHT care.",
    tips: [
      {
        title: "It's normal to feel anxious about when the next bleed will happen",
        body: "A large 2023–24 international study of over 1,000 adults with HHT found meaningful effects on emotional (22%), social (18%), and role functioning (25%) — and that severe epistaxis was linked to higher rates of depression, anxiety, and fatigue. You are not overreacting; this is a documented part of living with HHT.",
        tag: "You're not alone",
        src: "Cross-sectional HHT quality-of-life & psychological health study, 2024"
      },
      {
        title: "Stress doesn't cause HHT, but it can make you notice symptoms more",
        body: "Stress raises blood pressure and heart rate, which can make an already fragile nose more prone to bleeding for some people. Simple, low-effort stress relief — a short walk, breathing exercises, a favorite show — is a legitimate part of self-care, not a luxury.",
        tag: "Daily habit",
        src: "Patient-reported HHT lifestyle triggers"
      },
      {
        title: "Connect with other HHT patients",
        body: "Cure HHT and local HHT patient groups offer community connections, walks, and forums. Talking to someone who 'gets it' without explanation is often more relieving than advice from people who don't have HHT.",
        tag: "Community",
        src: "Cure HHT patient community programs"
      },
      {
        title: "Ask your care team about mental health support directly",
        body: "Because psychological distress is common but under-discussed in HHT, it often isn't asked about unless you bring it up. A referral to counseling or a therapist familiar with chronic illness can be part of your HHT care plan, not separate from it.",
        tag: "Ask for it",
        src: "Neuropsychiatric manifestations in HHT literature review, 2022"
      },
      {
        title: "Give yourself credit for the invisible work",
        body: "Tracking nosebleeds, managing iron levels, remembering screenings, and navigating new doctors is real, ongoing effort — even on days that look 'fine' from the outside. Acknowledging that is part of coping well.",
        tag: "Mindset",
        src: "HHT quality-of-life research"
      }
    ]
  }
];

export const preventionByAge = [
  {
    id: "children",
    label: "Children (0–12)",
    icon: "🧒",
    focus: "Gentle nasal habits, family screening conversations, and reassurance — most kids with HHT have mild symptoms early on.",
    tips: [
      "Keep a child-safe nasal saline gel or spray on hand and make applying it part of the morning/bedtime routine, like brushing teeth.",
      "Teach 'no digging' early — gently redirect nose-picking, which is a very common trigger for childhood nosebleeds.",
      "Run a cool-mist humidifier in the bedroom, especially in dry winter months, and clean it regularly to prevent mold.",
      "If a parent has HHT, ask the doctor about genetic testing for the child — this guides which screenings (brain MRI, lung AVM check) are needed even before symptoms appear.",
      "Know that HHT symptoms are often mild or absent in young children — a normal exam now doesn't rule out HHT if there's a family history.",
      "Keep nosebleed first-aid simple and calm: sit up, lean forward, pinch the soft part of the nose for 10 minutes — practice it together so it isn't scary."
    ]
  },
  {
    id: "teens",
    label: "Teens (13–19)",
    icon: "🧑‍🎓",
    focus: "Nosebleeds often become more frequent in the teen years — building independent self-care habits and protecting confidence matters most.",
    tips: [
      "Carry a small 'nosebleed kit' (nasal moisturizer, tissues, a small mirror) in a school bag or sports bag for independence away from home.",
      "Talk to a coach or PE teacher about contact-sport risks and reasonable alternatives or protective gear if nosebleeds are frequent.",
      "Expect — and normalize — that nosebleeds can increase in frequency and severity through the teen years; this is a known pattern, not a sign something is going wrong.",
      "Encourage consistent use of nasal moisturizer even when things feel fine, since teens often stop routines once symptoms are quiet.",
      "Watch for signs of social anxiety or embarrassment around nosebleeds at school, and keep the conversation open — this is a well-documented emotional burden at this age.",
      "Start shifting screening conversations (lung AVM checks, brain MRI results) toward the teen directly, so they understand their own case going into adulthood."
    ]
  },
  {
    id: "adults",
    label: "Adults (20–49)",
    icon: "🧑",
    focus: "This is peak 'juggling it all' territory — work, family, and finally staying on top of your own screening schedule.",
    tips: [
      "Get baseline screening done if you haven't already: bubble echocardiogram for lung AVMs and a contrast brain MRI, ideally at an HHT Center of Excellence.",
      "Build your daily nasal-moisturizing habit around your existing routine (next to your toothbrush, your bedside table) so it actually sticks.",
      "Get annual bloodwork (hemoglobin, ferritin, iron panel) even if nosebleeds feel 'manageable' — anemia can creep up quietly.",
      "If you're planning a pregnancy, talk to your HHT specialist beforehand about screening timing — this is the single biggest planning window for this age group.",
      "Mention your HHT to every new doctor and dentist, including for unrelated procedures — antibiotic and anesthesia planning may need to change.",
      "Review medications and supplements yearly with your doctor, especially if you've started anything new for pain, sleep, or general wellness."
    ]
  },
  {
    id: "older-adults",
    label: "Older Adults (50+)",
    icon: "🧓",
    focus: "Nosebleeds and other bleeding sources (GI, liver) tend to become more prominent — screening frequency and coordination matter more than ever.",
    tips: [
      "Nosebleed severity tends to increase with age in HHT — don't assume a worsening pattern is 'just aging'; mention it to your specialist.",
      "Ask about GI screening if your anemia seems out of proportion to your visible nosebleeds — GI bleeding from telangiectasias becomes more common after 50.",
      "Liver vascular malformations are common in HHT and become more likely to cause symptoms with age — report new abdominal symptoms or unusual fatigue.",
      "Keep up annual bloodwork without gaps — iron deficiency in this age group can also overlap with other causes, so regular checks help sort out what's what.",
      "If you're on blood thinners for heart health, make sure your cardiologist and HHT specialist are coordinating, not managing your case in isolation.",
      "Consider re-confirming your lung and brain AVM screening status if it's been more than 5–10 years since your last check."
    ]
  },
  {
    id: "pregnancy",
    label: "Pregnancy",
    icon: "🤰",
    focus: "Pregnancy raises blood volume and vessel pressure — this is the life stage where proactive screening and a specialist team matter most.",
    tips: [
      "If you haven't had recent lung AVM screening, guidelines recommend it in pregnancy, using a non-radiation option like contrast echocardiogram, or a low-dose CT early in the second trimester if needed.",
      "Untreated pulmonary AVMs found during pregnancy are generally treated starting in the second trimester, since pregnancy increases blood flow and related risks.",
      "An asymptomatic brain vascular malformation found before or during pregnancy doesn't need treatment during pregnancy — it's typically addressed after delivery.",
      "You can have an epidural and a vaginal delivery — HHT alone is not a reason to withhold epidural anesthesia, and spinal screening isn't required for most patients.",
      "Get care at a center with a multidisciplinary HHT team if you have untreated pulmonary or brain AVMs, or haven't been screened recently — this is specifically recommended for pregnant patients with HHT.",
      "Expect closer monitoring of iron levels, since pregnancy itself increases iron needs on top of any HHT-related blood loss.",
      "Loop in your HHT specialist as early as possible when you're planning a pregnancy, not just once you're expecting — timing screenings ahead of time gives everyone more options."
    ]
  }
];

// A curated, evidence-checked version of a real everyday HHT self-care routine.
export const everydayRoutine = [
  {
    time: "Morning",
    items: [
      "Apply nasal moisturizer (saline gel or an oil-based emollient like Ponaris) in both nostrils before starting the day.",
      "Take iron supplement (if prescribed) with a source of vitamin C, and space it away from coffee, tea, or calcium.",
      "Check in with yourself — any dizziness, unusual tiredness, or paleness worth noting today?"
    ]
  },
  {
    time: "Daytime",
    items: [
      "Keep a small nasal moisturizer or saline spray within reach (bag, desk, car) for reapplication if your nose feels dry.",
      "Go easy on added salt at meals, and if a dish is very spicy, notice how your nose responds afterward.",
      "Skip the ibuprofen/naproxen for headaches or aches — reach for acetaminophen instead, or check with your doctor.",
      "If a nosebleed starts: sit up, lean slightly forward, and pinch the soft part of your nose firmly for a full 10–15 minutes without peeking."
    ]
  },
  {
    time: "Evening",
    items: [
      "Reapply nasal moisturizer before bed — this is the single most protective habit against overnight dryness and morning nosebleeds.",
      "Run a clean humidifier in the bedroom, especially in dry or heated/air-conditioned air.",
      "Keep alcohol light, and notice your own pattern if you drink — it's the most commonly reported nosebleed trigger in HHT patients.",
      "Wind down with something low-stress — stress itself doesn't cause HHT, but it can make an already fragile nose more reactive."
    ]
  },
  {
    time: "Ongoing",
    items: [
      "Yearly: hemoglobin, ferritin, and iron panel bloodwork, even if nosebleeds feel stable.",
      "Every 5–10 years (or as advised): lung AVM rescreening with bubble echocardiogram.",
      "At diagnosis, and again if new symptoms appear: brain MRI screening.",
      "Every dental visit and new medical procedure: mention your HHT status and ask whether antibiotic prophylaxis applies to you.",
      "Keep your full supplement and medication list updated and bring it to every appointment.",
      "Stay connected to an HHT Center of Excellence or specialist who can coordinate your whole picture — nose, lungs, brain, liver, GI, and iron."
    ]
  }
];
