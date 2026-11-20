/**
 * Exam bank (static). Server-only: it contains the answers.
 *
 * Question types
 *  - mcq     : { options: string[], answer: <index> }
 *  - text    : { answer: string | string[] }  (case-insensitive, any accepted value)
 *  - writing : { minWords }                     (stored, NOT auto-scored)
 *
 * Section.script  -> read aloud with the browser's speech synthesis (Listening)
 * Section.passage -> shown above the questions (Reading)
 * Question ids must be unique inside one exam.
 */
const TFNG = ['True', 'False', 'Not Given'];

export const EXAMS = [
  /* ------------------------------------------------------------------ */
  {
    id: 'ielts-academic-1',
    type: 'IELTS',
    level: 'Academic',
    title: 'آیلتس آکادمیک – آزمون آزمایشی ۱',
    description:
      'نسخهٔ فشردهٔ آیلتس آکادمیک با بخش‌های Listening، Reading و Writing Task 2؛ مناسب سنجش سریع سطح.',
    durationMin: 40,
    sections: [
      {
        id: 's1',
        skill: 'listening',
        title: 'Listening – Library induction',
        instructions: 'You will hear the recording twice. Answer the questions below.',
        script:
          'Good morning, and welcome to Riverside University Library. My name is Helen, and I will explain how our services work. The library is open from eight in the morning until ten at night on weekdays, but on weekends it closes at six. To borrow books you need a student card, which you can collect from the main desk. Students can borrow up to ten books for three weeks, and each book can be renewed once online. If a book is returned late, the fine is fifty pence per day. Finally, group study rooms are on the second floor, and they must be booked at least one day in advance.',
        questions: [
          { id: 'l1', type: 'mcq', text: 'On weekdays the library closes at…', options: ['6 p.m.', '8 p.m.', '10 p.m.', 'Midnight'], answer: 2 },
          { id: 'l2', type: 'text', text: 'How many books can a student borrow? (one number or word)', answer: ['10', 'ten'] },
          { id: 'l3', type: 'mcq', text: 'What is the fine for a late book?', options: ['50p per day', '£1 per day', '50p per week', '£5 per book'], answer: 0 },
          { id: 'l4', type: 'text', text: 'Group study rooms are on the ______ floor.', answer: ['second', '2nd'] },
        ],
      },
      {
        id: 's2',
        skill: 'reading',
        title: 'Reading – The rise of urban beekeeping',
        instructions: 'Choose True, False or Not Given according to the passage.',
        passage:
          'Over the past decade, beekeeping has moved from the countryside into the heart of major cities. Rooftops in London, Paris and New York now host thousands of hives. Supporters argue that cities can actually be better for bees than farmland. Intensive agriculture often relies on a single crop and heavy pesticide use, while urban gardens, parks and balconies offer a wide variety of flowers that bloom at different times of the year. As a result, urban bees often produce more honey per hive than their rural cousins.\n\nHowever, some ecologists warn that the trend has a downside. Honeybees compete with wild pollinators such as bumblebees and solitary bees for a limited supply of nectar. In several cities, the number of managed hives has grown faster than the number of flowering plants. Researchers therefore recommend that city councils plant more wildflowers before they encourage new hives, so that both honeybees and wild species can thrive.',
        questions: [
          { id: 'r1', type: 'mcq', text: 'Urban beekeeping has become popular only in European cities.', options: TFNG, answer: 1, explanation: 'New York هم در متن آمده است؛ پس عبارت «فقط اروپا» نادرست (False) است.' },
          { id: 'r2', type: 'mcq', text: 'Farmland often offers bees a less varied diet than cities do.', options: TFNG, answer: 0, explanation: 'متن می‌گوید کشاورزی متمرکز اغلب به یک محصول وابسته است، در حالی که شهرها گل‌های متنوع دارند.' },
          { id: 'r3', type: 'mcq', text: 'Urban hives always produce more honey than rural hives.', options: TFNG, answer: 1, explanation: 'متن از «اغلب» (often) استفاده کرده نه «همیشه» (always).' },
          { id: 'r4', type: 'mcq', text: 'Wild pollinators are more valuable than honeybees.', options: TFNG, answer: 2, explanation: 'متن دربارهٔ ارزش نسبی گونه‌ها نظری نمی‌دهد؛ Not Given.' },
          { id: 'r5', type: 'mcq', text: 'What do researchers recommend?', options: ['Banning all city hives', 'Planting more wildflowers before adding hives', 'Importing more honeybees', 'Reducing pesticide on farms'], answer: 1 },
          { id: 'r6', type: 'text', text: 'Honeybees compete with wild pollinators for a limited supply of ______.', answer: ['nectar'] },
        ],
      },
      {
        id: 's3',
        skill: 'writing',
        title: 'Writing – Task 2',
        instructions: 'Write at least 150 words. Plan, write, then check your grammar and spelling.',
        questions: [
          {
            id: 'w1',
            type: 'writing',
            text: 'Some people think that cities should spend more money on green spaces rather than on new roads. To what extent do you agree or disagree?',
            minWords: 150,
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'ielts-general-1',
    type: 'IELTS',
    level: 'General Training',
    title: 'آیلتس جنرال – آزمون آزمایشی ۱',
    description:
      'مناسب متقاضیان مهاجرت و کار؛ شامل متن‌های روزمره، شنیداری کوتاه، گرامر و نوشتن نامه.',
    durationMin: 30,
    sections: [
      {
        id: 's1',
        skill: 'reading',
        title: 'Reading – Notice to residents',
        instructions: 'Read the notice and answer the questions.',
        passage:
          'NOTICE TO RESIDENTS – MAPLE COURT APARTMENTS\n\nThe water supply to all apartments will be turned off on Saturday 14 June between 9 a.m. and 1 p.m. while engineers replace the main pipe in the basement. Residents are advised to store drinking water in advance. The building’s car park will remain open, but the lift to the basement will not operate. Anyone with a medical need for a continuous water supply should contact the building manager, Ms Dunn, before Thursday. We apologise for any inconvenience.',
        questions: [
          { id: 'r1', type: 'mcq', text: 'Why will the water be turned off?', options: ['To clean the tanks', 'To replace a pipe', 'To repair the lift', 'To paint the basement'], answer: 1 },
          { id: 'r2', type: 'mcq', text: 'Which service will NOT work during the repairs?', options: ['The car park', 'The basement lift', 'The front door', 'The telephone'], answer: 1 },
          { id: 'r3', type: 'text', text: 'Who should residents with medical needs contact?', answer: ['ms dunn', 'ms. dunn', 'dunn', 'the building manager', 'building manager', 'the manager', 'manager'] },
          { id: 'r4', type: 'mcq', text: 'For how long will the water be off?', options: ['Two hours', 'Four hours', 'Six hours', 'All day'], answer: 1, explanation: 'از ۹ صبح تا ۱ بعدازظهر یعنی چهار ساعت.' },
        ],
      },
      {
        id: 's2',
        skill: 'listening',
        title: 'Listening – Voicemail message',
        instructions: 'You will hear a short phone message.',
        script:
          'Hello, this is a message for Mr Roberts. I am calling from Quick Delivery about your parcel. We tried to deliver it this morning, but nobody was at home. We will try again tomorrow between two and five in the afternoon. If you cannot be at home, you can collect the parcel from our depot on Station Road, which is open until seven o’clock. Please bring a photo ID. Thank you.',
        questions: [
          { id: 'l1', type: 'mcq', text: 'Why is the company calling?', options: ['The parcel was damaged', 'Nobody was home to receive it', 'The address was wrong', 'Payment is missing'], answer: 1 },
          { id: 'l2', type: 'mcq', text: 'When will they try again?', options: ['Tomorrow morning', 'Tomorrow between 2 and 5 p.m.', 'Tonight', 'Next week'], answer: 1 },
          { id: 'l3', type: 'mcq', text: 'What must Mr Roberts bring to the depot?', options: ['Photo ID', 'A credit card', 'The delivery note', 'A letter'], answer: 0 },
        ],
      },
      {
        id: 's3',
        skill: 'grammar',
        title: 'Grammar & Vocabulary',
        instructions: 'Choose the best option.',
        questions: [
          { id: 'g1', type: 'mcq', text: 'If I ____ more time, I would learn another language.', options: ['have', 'had', 'will have', 'would have'], answer: 1, explanation: 'جملهٔ شرطی نوع دوم: If + گذشتهٔ ساده، would + مصدر.' },
          { id: 'g2', type: 'mcq', text: 'She has been working here ____ 2019.', options: ['for', 'since', 'from', 'during'], answer: 1, explanation: 'برای نقطهٔ شروع زمان از since استفاده می‌شود.' },
          { id: 'g3', type: 'mcq', text: 'The manager asked me to ____ the report by Friday.', options: ['submit', 'submits', 'submitting', 'submitted'], answer: 0 },
        ],
      },
      {
        id: 's4',
        skill: 'writing',
        title: 'Writing – Task 1 (Letter)',
        instructions: 'Write at least 120 words.',
        questions: [
          {
            id: 'w1',
            type: 'writing',
            text: 'You recently stayed in a hotel and were unhappy with the service. Write a letter to the manager. Explain what happened and say what you want him to do.',
            minWords: 120,
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'pte-academic-1',
    type: 'PTE',
    level: 'Academic',
    title: 'پی‌تی‌ای آکادمیک – آزمون آزمایشی ۱',
    description:
      'تمرین Reading، Listening، واژگان و Essay با فرمت کامپیوتری و بدون فشار زمانی اضافه.',
    durationMin: 35,
    sections: [
      {
        id: 's1',
        skill: 'reading',
        title: 'Reading – Remote work and productivity',
        instructions: 'Read the passage and answer the questions.',
        passage:
          'Remote work has changed the way companies think about productivity. Early studies suggested that employees working from home completed more tasks because they had fewer interruptions and no commute. More recent research, however, shows a more complex picture. Workers in creative roles often report that spontaneous conversations with colleagues help them generate new ideas, and these are harder to reproduce online. For this reason, many organisations now prefer a hybrid model, in which staff spend part of the week in the office and part at home.',
        questions: [
          { id: 'r1', type: 'mcq', text: 'According to early studies, why did remote employees complete more tasks?', options: ['They worked longer hours', 'They had fewer interruptions', 'They received higher pay', 'They used better software'], answer: 1 },
          { id: 'r2', type: 'mcq', text: 'What do creative workers value about the office?', options: ['Quiet rooms', 'Spontaneous conversations', 'Free meals', 'Shorter hours'], answer: 1 },
          { id: 'r3', type: 'mcq', text: 'What is a hybrid model?', options: ['Working only at home', 'Working only in the office', 'A mix of home and office', 'Working in several countries'], answer: 2 },
          { id: 'r4', type: 'text', text: 'Recent research shows a more ______ picture.', answer: ['complex'] },
        ],
      },
      {
        id: 's2',
        skill: 'listening',
        title: 'Listening – Sleep and memory',
        instructions: 'Listen to the short lecture and answer the questions.',
        script:
          'Sleep plays a crucial role in how we remember things. During the day, we collect new information, but this information is fragile. While we sleep, particularly in the deep stages of sleep, the brain replays the events of the day and moves important memories into long-term storage. Studies show that students who sleep for eight hours after learning new vocabulary remember significantly more words than those who stay awake. For this reason, researchers advise against studying all night before an exam.',
        questions: [
          { id: 'l1', type: 'mcq', text: 'What happens to memories during deep sleep?', options: ['They are deleted', 'They are moved to long-term storage', 'They become emotions', 'They are mixed with dreams'], answer: 1 },
          { id: 'l2', type: 'text', text: 'How many hours did the successful students sleep? (number or word)', answer: ['8', 'eight', '8 hours', 'eight hours'] },
          { id: 'l3', type: 'mcq', text: 'What do researchers advise?', options: ['Studying all night', 'Avoiding exams', 'Not staying up all night before an exam', 'Sleeping during lectures'], answer: 2 },
        ],
      },
      {
        id: 's3',
        skill: 'grammar',
        title: 'Vocabulary & Grammar',
        instructions: 'Choose the word or phrase that best completes each sentence.',
        questions: [
          { id: 'g1', type: 'mcq', text: 'The committee has decided to ____ the proposal until next month.', options: ['postpone', 'prepone', 'precede', 'proceed'], answer: 0 },
          { id: 'g2', type: 'mcq', text: 'Neither the teachers nor the principal ____ aware of the change.', options: ['was', 'were', 'are', 'be'], answer: 0, explanation: 'فعل با نزدیک‌ترین فاعل (principal) مطابقت می‌کند.' },
          { id: 'g3', type: 'mcq', text: 'Her argument was so ____ that nobody could disagree.', options: ['persuasive', 'persuade', 'persuasion', 'persuasively'], answer: 0 },
        ],
      },
      {
        id: 's4',
        skill: 'writing',
        title: 'Writing – Essay',
        instructions: 'Write at least 100 words.',
        questions: [
          {
            id: 'w1',
            type: 'writing',
            text: 'Some people believe universities should focus on practical skills rather than theory. Discuss both views and give your own opinion.',
            minWords: 100,
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    id: 'toefl-ibt-1',
    type: 'TOEFL',
    level: 'iBT',
    title: 'تافل آی‌بی‌تی – آزمون آزمایشی ۱',
    description:
      'متن علمی کوتاه، سخنرانی دانشگاهی و Independent Writing با ساختار نزدیک به آزمون اصلی.',
    durationMin: 35,
    sections: [
      {
        id: 's1',
        skill: 'reading',
        title: 'Reading – Coral reefs',
        instructions: 'Read the passage and answer the questions.',
        passage:
          'Coral reefs cover less than one percent of the ocean floor, yet they support about a quarter of all marine species. Corals are tiny animals that live in partnership with microscopic algae. The algae give the coral its bright colour and produce food through photosynthesis. When the water becomes too warm, the coral expels the algae, turns white, and becomes vulnerable to disease. This process is known as bleaching. A bleached reef can recover if temperatures fall quickly, but repeated events over a few years often kill large sections of coral. Scientists are now testing heat-resistant coral varieties in laboratories in the hope of restoring damaged reefs.',
        questions: [
          { id: 'r1', type: 'mcq', text: 'What share of the ocean floor do coral reefs cover?', options: ['Less than 1%', 'About 25%', 'About 50%', 'More than 10%'], answer: 0 },
          { id: 'r2', type: 'mcq', text: 'Why does coral turn white?', options: ['It loses its algae', 'It runs out of oxygen', 'It is covered by sand', 'It produces too much food'], answer: 0 },
          { id: 'r3', type: 'mcq', text: 'The word “vulnerable” in the passage is closest in meaning to…', options: ['strong', 'exposed', 'invisible', 'attractive'], answer: 1 },
          { id: 'r4', type: 'mcq', text: 'What are scientists testing?', options: ['Cooling devices for oceans', 'Heat-resistant coral varieties', 'New fishing rules', 'Artificial algae'], answer: 1 },
          { id: 'r5', type: 'text', text: 'Coral expels the algae when the water becomes too ______.', answer: ['warm', 'hot'] },
        ],
      },
      {
        id: 's2',
        skill: 'listening',
        title: 'Listening – The printing press',
        instructions: 'Listen to part of a lecture and answer the questions.',
        script:
          'Today we will talk about the impact of the printing press. Before Johannes Gutenberg introduced movable type in the fifteenth century, books were copied by hand, which made them rare and expensive. Within fifty years of his invention, millions of books had been printed across Europe. This led to a sharp rise in literacy, because ordinary people could finally afford to read. It also helped scientific ideas spread quickly, since researchers in different countries could share their results in print.',
        questions: [
          { id: 'l1', type: 'mcq', text: 'Who introduced movable type in Europe?', options: ['Isaac Newton', 'Johannes Gutenberg', 'Leonardo da Vinci', 'Galileo'], answer: 1 },
          { id: 'l2', type: 'mcq', text: 'Before the printing press, books were…', options: ['free', 'copied by hand', 'kept in schools', 'written in code'], answer: 1 },
          { id: 'l3', type: 'mcq', text: 'Which was a result of printing?', options: ['Fewer scientists', 'A rise in literacy', 'Higher book prices', 'The end of universities'], answer: 1 },
        ],
      },
      {
        id: 's3',
        skill: 'writing',
        title: 'Writing – Independent task',
        instructions: 'Write at least 100 words. Use specific reasons and examples.',
        questions: [
          {
            id: 'w1',
            type: 'writing',
            text: 'Do you agree or disagree with the following statement? Students learn more effectively in small groups than in large classes.',
            minWords: 100,
          },
        ],
      },
    ],
  },
];
