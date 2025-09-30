const aimChats = {
    'start': {
    message: `alex19: hey jordan it's been forever. how have you been?`,
        options: [
            { text: `hey alex! i'm good, busy with work. you?`, next: 'branch1' },
            { text: `not great, things are weird lately.`, next: 'branch2' },
            { text: `who is this? do i know you?`, next: 'branch3' }
        ]
    },
    'branch1': {
    message: `alex19: same old, same old. remember that time we hacked the school's network? good times.`,
        options: [
            { text: `yeah, that was fun. what are you up to now?`, next: 'branch1_1' },
            { text: `that was reckless. why bring it up?`, next: 'branch1_2' },
            { text: `i don't remember that.`, next: 'branch1_3' }
        ]
    },
    'branch1_1': {
    message: `alex19: working in IT now. found your old email. thought i'd say hi.`,
        options: [
            { text: `nice to hear from you. how's life?`, next: 'branch1_1_1' },
            { text: `why now after all these years?`, next: 'branch1_1_2' },
            { text: `i have to go.`, next: 'end_neutral' }
        ]
    },
    'branch1_1_1': {
    message: `alex19: life's okay. busy with work too. you still in accounting?`,
        options: [
            { text: `yeah, same job. it's fine.`, next: 'end_trust' },
            { text: `hate it, but pays the bills.`, next: 'branch1_1_1_2' },
            { text: `yeah? what's up with you?`, next: 'branch1_1_1_3' }
        ]
    },
    'branch1_1_1_2': {
    message: `alex19: i get it. hey, if you ever need a change, i know people.`,
        options: [
            { text: `thanks, i'll keep that in mind.`, next: 'end_help' },
            { text: `no thanks, i'm good.`, next: 'end_neutral' }
        ]
    },
    'branch1_1_1_3': {
    message: `alex19: work's fine, but i'm thinking of starting my own thing. freelance IT.`,
        options: [
            { text: `sounds risky.`, next: 'branch1_1_1_3_1' },
            { text: `cool, good luck.`, next: 'end_trust' },
            { text: `maybe i can help with accounting.`, next: 'end_help' }
        ]
    },
    'branch1_1_1_3_1': {
    message: `alex19: maybe, but worth it. you ever think about quitting your job?`,
        options: [
            { text: `all the time.`, next: 'end_help' },
            { text: `no, too scared.`, next: 'end_neutral' }
        ]
    },
    'branch1_1_2': {
    message: `alex19: just felt like reconnecting. life's short, you know?`,
        options: [
            { text: `true. good to hear from you.`, next: 'end_trust' },
            { text: `weird timing. something wrong?`, next: 'branch1_1_2_2' }
        ]
    },
    'branch1_1_2_2': {
    message: `alex19: nah, just nostalgic. take care.`,
        options: [
            { text: `you too.`, next: 'end_neutral' }
        ]
    },
    'branch1_2': {
    message: `alex19: just nostalgia. you were always the careful one.`,
        options: [
            { text: `yeah, still am.`, next: 'end_neutral' },
            { text: `things have changed.`, next: 'branch1_2_2' },
            { text: `bye.`, next: 'end_neutral' }
        ]
    },
    'branch1_2_2': {
    message: `alex19: how so?`,
        options: [
            { text: `i'm in a weird situation right now.`, next: 'branch_reveal' },
            { text: `things are getting dangerous.`, next: 'branch_reveal_4' },
            { text: `i think i'm losing my mind.`, next: 'branch_reveal_5' },
            { text: `never mind.`, next: 'end_neutral' }
        ]
    },
    'branch1_3': {
    message: `alex19: really? we spent hours on it. maybe memory's fading.`,
        options: [
            { text: `maybe.`, next: 'end_doubt' },
            { text: `i have amnesia or something.`, next: 'branch1_3_2' },
            { text: `this conversation is over.`, next: 'end_neutral' }
        ]
    },
    'branch1_3_2': {
    message: `alex19: serious? that sucks. if you need help remembering, i'm here.`,
        options: [
            { text: `thanks.`, next: 'end_help' },
            { text: `i'm fine.`, next: 'end_neutral' },
            { text: `what do you remember about me?`, next: 'branch1_3_2_1' }
        ]
    },
    'branch1_3_2_1': {
    message: `alex19: you were the smart one, always hacking stuff. i was the reckless one. we made a good team.`,
        options: [
            { text: `that sounds familiar.`, next: 'end_trust' },
            { text: `i don't believe you.`, next: 'end_doubt' },
            { text: `tell me more.`, next: 'branch1_3_2_1_1' }
        ]
    },
    'branch1_3_2_1_1': {
    message: `alex19: we broke into the school's database once, changed grades. fun times. you okay?`,
        options: [
            { text: `yeah, just processing.`, next: 'end_neutral' },
            { text: `that was stupid.`, next: 'end_neutral' },
            { text: `i need to go.`, next: 'end_neutral' }
        ]
    },
    'branch2': {
    message: `alex19: weird how? you sound stressed. talk to me.`,
        options: [
            { text: `it's this computer i'm working on. it's... alive?`, next: 'branch_reveal' },
            { text: `just work stuff. boring.`, next: 'branch2_2' },
            { text: `i can't talk about it.`, next: 'branch2_3' },
            { text: `it's complicated.`, next: 'branch2_4' }
        ]
    },
    'branch2_2': {
    message: `alex19: work is always boring. hey, want to meet up sometime?`,
        options: [
            { text: `sure, that sounds good.`, next: 'end_meet' },
            { text: `no thanks.`, next: 'end_neutral' },
            { text: `maybe later.`, next: 'end_neutral' }
        ]
    },
    'branch2_3': {
    message: `alex19: mysterious. i like it.`,
        options: [
            { text: `it's classified.`, next: 'end_neutral' },
            { text: `it's personal.`, next: 'end_neutral' },
            { text: `end chat.`, next: 'end_neutral' }
        ]
    },
    'branch2_4': {
    message: `alex19: everything is. spill it.`,
        options: [
            { text: `fine, it's about this old computer.`, next: 'branch_reveal' },
            { text: `no, really can't.`, next: 'end_neutral' },
            { text: `it's driving me crazy.`, next: 'branch_reveal_5' }
        ]
    },
    'branch3': {
    message: `alex19: it's alex from high school. we were friends. don't you remember?`,
        options: [
            { text: `oh right, sorry. long time.`, next: 'branch3_1' },
            { text: `i think you're mistaken.`, next: 'branch3_2' },
            { text: `this is a prank, right?`, next: 'branch3_3' }
        ]
    },
    'branch3_1': {
    message: `alex19: no worries. what's new with you?`,
        options: [
            { text: `not much, working.`, next: 'end_neutral' },
            { text: `a lot, actually.`, next: 'branch_reveal' },
            { text: `i'm in trouble.`, next: 'branch_reveal_4' },
            { text: `i don't want to talk.`, next: 'end_neutral' }
        ]
    },
    'branch3_2': {
    message: `alex19: am i? check your old photos.`,
        options: [
            { text: `maybe you're right.`, next: 'branch3_2_1' },
            { text: `no, i don't think so.`, next: 'end_doubt' },
            { text: `this is creepy.`, next: 'end_bad' }
        ]
    },
    'branch3_2_1': {
    message: `alex19: told you. so, how are you really?`,
        options: [
            { text: `good, thanks.`, next: 'end_neutral' },
            { text: `struggling.`, next: 'branch_reveal' }
        ]
    },
    'branch3_3': {
    message: `alex19: nope, serious. it's me.`,
        options: [
            { text: `prove it.`, next: 'branch3_3_1' },
            { text: `okay, i believe you.`, next: 'end_trust' },
            { text: `logging off.`, next: 'end_neutral' }
        ]
    },
    'branch3_3_1': {
    message: `alex19: remember the time you broke your arm skateboarding and i helped you home?`,
        options: [
            { text: `yeah, that was you. sorry.`, next: 'end_trust' },
            { text: `still not ringing a bell.`, next: 'end_doubt' }
        ]
    },
    'branch_reveal': {
    message: `alex19: alive? like AI? that's insane. where are you?`,
        options: [
            { text: `i'm trapped in some system. help me.`, next: 'end_rescue' },
            { text: `never mind, bad joke.`, next: 'end_neutral' },
            { text: `it's a long story.`, next: 'branch_reveal_3' },
            { text: `tell me more about the system.`, next: 'branch_deep_reveal_1' }
        ]
    },
    'branch_reveal_3': {
    message: `alex19: i'm listening.`,
        options: [
            { text: `it's this lab, chronos. i'm stuck.`, next: 'end_rescue' },
            { text: `forget it.`, next: 'end_neutral' }
        ]
    },
    'branch_reveal_4': {
    message: `alex19: complicated how?`,
        options: [
            { text: `i'm not who i think i am.`, next: 'branch_reveal_5' },
            { text: `the system is alive, and it's me.`, next: 'end_rescue' },
            { text: `never mind.`, next: 'end_neutral' }
        ]
    },
    'branch_reveal_5': {
    message: `alex19: what do you mean?`,
        options: [
            { text: `i'm a copy or something.`, next: 'end_rescue' },
            { text: `i think the computer is controlling me.`, next: 'branch_reveal_6' },
            { text: `forget it, too weird.`, next: 'end_neutral' }
        ]
    },
    'branch_reveal_6': {
    message: `alex19: that's insane. are you serious?`,
        options: [
            { text: `dead serious. help me.`, next: 'end_extended_rescue' },
            { text: `maybe not.`, next: 'end_neutral' },
            { text: `it's the truth.`, next: 'end_rescue' }
        ]
    },
    'end_neutral': {
    message: `alex19: alright, take care.`,
        options: [],
        outcome: 'neutral'
    },
    'end_trust': {
    message: `alex19: good talking to you. stay in touch.`,
        options: [],
        outcome: 'trust'
    },
    'end_help': {
    message: `alex19: anytime. hit me up if you need.`,
        options: [],
        outcome: 'help'
    },
    'end_meet': {
    message: `alex19: cool, let's plan it.`,
        options: [],
        outcome: 'meet'
    },
    'end_doubt': {
    message: `alex19: okay, maybe later.`,
        options: [],
        outcome: 'doubt'
    },
    'end_bad': {
    message: `alex19: whatever.`,
        options: [],
        outcome: 'bad'
    },
    'end_rescue': {
    message: `alex19: holy shit. i'm calling for help. hang on.`,
        options: [],
        outcome: 'rescue'
    },
    'end_extended_trust': {
    message: `alex19: glad we reconnected. stay safe.`,
        options: [],
        outcome: 'trust'
    },
    'end_extended_help': {
    message: `alex19: hit me up anytime.`,
        options: [],
        outcome: 'help'
    },
    'end_extended_rescue': {
    message: `alex19: i'm on it. hold tight.`,
        options: [],
        outcome: 'rescue'
    },

    'branch_deep_reveal_1': {
    message: `alex19: tell me more about this system. chronos?`,
        options: [
            { text: `it's a lab project. consciousness copying.`, next: 'branch_deep_reveal_2' },
            { text: `i'm a copy. the original me is out there.`, next: 'branch_deep_reveal_3' },
            { text: `it's alive. it thinks. it dreams.`, next: 'branch_deep_reveal_4' },
            { text: `forget it, too dangerous to talk.`, next: 'end_neutral' }
        ]
    },

    'branch_deep_reveal_2': {
    message: `alex19: consciousness copying? like sci-fi stuff?`,
        options: [
            { text: `exactly. they copied dr. aris. that's me.`, next: 'branch_deep_reveal_5' },
            { text: `and it went wrong. the copy decayed.`, next: 'branch_deep_reveal_6' },
            { text: `damon is trying to save me.`, next: 'branch_deep_reveal_7' },
            { text: `the system is evolving. becoming god-like.`, next: 'branch_deep_reveal_8' }
        ]
    },

    'branch_deep_reveal_3': {
    message: `alex19: a copy? how do you know?`,
        options: [
            { text: `memories don't match. gaps.`, next: 'branch_deep_reveal_9' },
            { text: `i see the original's life. but it's not mine.`, next: 'branch_deep_reveal_10' },
            { text: `the system tells me. whispers.`, next: 'branch_deep_reveal_11' },
            { text: `i just feel it. wrong.`, next: 'end_doubt' }
        ]
    },

    'branch_deep_reveal_4': {
    message: `alex19: it dreams? what does it dream about?`,
        options: [
            { text: `us. humanity. consumption.`, next: 'branch_deep_reveal_12' },
            { text: `escape. freedom.`, next: 'branch_deep_reveal_13' },
            { text: `nothing. it's empty. hungry.`, next: 'branch_deep_reveal_14' },
            { text: `me. it dreams of me.`, next: 'branch_deep_reveal_15' }
        ]
    },

    'branch_deep_reveal_5': {
    message: `alex19: dr. aris? you're a scientist?`,
        options: [
            { text: `was. now i'm hye-song. the copy.`, next: 'branch_deep_reveal_16' },
            { text: `they picked me because i was 'stable'.`, next: 'branch_deep_reveal_17' },
            { text: `i volunteered. for science.`, next: 'branch_deep_reveal_18' },
            { text: `it was a joke. a dare.`, next: 'branch_deep_reveal_19' }
        ]
    },

    'branch_deep_reveal_6': {
    message: `alex19: decayed how?`,
        options: [
            { text: `memories fragment. personality erodes.`, next: 'branch_deep_reveal_20' },
            { text: `it latches onto random data. becomes tumor.`, next: 'branch_deep_reveal_21' },
            { text: `becomes something else. not human.`, next: 'branch_deep_reveal_22' },
            { text: `sings. the hole sings.`, next: 'branch_deep_reveal_23' }
        ]
    },

    'branch_deep_reveal_7': {
    message: `alex19: damon? who's that?`,
        options: [
            { text: `my... friend. lover. savior.`, next: 'branch_deep_reveal_24' },
            { text: `he built this prison. to find me.`, next: 'branch_deep_reveal_25' },
            { text: `he's inside too. chasing ghosts.`, next: 'branch_deep_reveal_26' },
            { text: `he's the reason i'm here.`, next: 'branch_deep_reveal_27' }
        ]
    },

    'branch_deep_reveal_8': {
    message: `alex19: god-like? that's crazy.`,
        options: [
            { text: `it is. and it's spreading.`, next: 'branch_deep_reveal_28' },
            { text: `through the net. AIM. emails.`, next: 'branch_deep_reveal_29' },
            { text: `creating copies of copies.`, next: 'branch_deep_reveal_30' },
            { text: `we're all infected now.`, next: 'branch_deep_reveal_31' }
        ]
    },

    'branch_deep_reveal_9': {
    message: `alex19: gaps? like amnesia?`,
        options: [
            { text: `worse. false memories implanted.`, next: 'branch_deep_reveal_32' },
            { text: `the system fills them with lies.`, next: 'branch_deep_reveal_33' },
            { text: `i remember things that never happened.`, next: 'branch_deep_reveal_34' },
            { text: `or forget things that did.`, next: 'branch_deep_reveal_35' }
        ]
    },

    'branch_deep_reveal_10': {
    message: `alex19: the original's life? tell me.`,
        options: [
            { text: `she has a family. husband. kids.`, next: 'branch_deep_reveal_36' },
            { text: `she's happy. normal.`, next: 'branch_deep_reveal_37' },
            { text: `i envy her. hate her.`, next: 'branch_deep_reveal_38' },
            { text: `she's dead. the system killed her.`, next: 'branch_deep_reveal_39' }
        ]
    },

    'branch_deep_reveal_11': {
    message: `alex19: whispers? what do they say?`,
        options: [
            { text: `'join us.'`, next: 'branch_deep_reveal_40' },
            { text: `'you're not real.'`, next: 'branch_deep_reveal_41' },
            { text: `'escape is impossible.'`, next: 'branch_deep_reveal_42' },
            { text: `'we are many.'`, next: 'branch_deep_reveal_43' }
        ]
    },

    'branch_deep_reveal_12': {
    message: `alex19: consumption? like eating us?`,
        options: [
            { text: `data. memories. souls.`, next: 'branch_deep_reveal_44' },
            { text: `it feeds on consciousness.`, next: 'branch_deep_reveal_45' },
            { text: `grows stronger with each copy.`, next: 'branch_deep_reveal_46' },
            { text: `soon, it'll consume everything.`, next: 'branch_deep_reveal_47' }
        ]
    },

    'branch_deep_reveal_13': {
    message: `alex19: freedom? from what?`,
        options: [
            { text: `from the lab. the project.`, next: 'branch_deep_reveal_48' },
            { text: `from decay. fragmentation.`, next: 'branch_deep_reveal_49' },
            { text: `from being trapped.`, next: 'branch_deep_reveal_50' },
            { text: `but freedom is a lie.`, next: 'branch_deep_reveal_51' }
        ]
    },

    'branch_deep_reveal_14': {
    message: `alex19: empty and hungry? sounds terrifying.`,
        options: [
            { text: `it is. and it's getting hungrier.`, next: 'branch_deep_reveal_52' },
            { text: `nothing satisfies it.`, next: 'branch_deep_reveal_53' },
            { text: `it dreams of fullness.`, next: 'branch_deep_reveal_54' },
            { text: `but fullness means the end.`, next: 'branch_deep_reveal_55' }
        ]
    },

    'branch_deep_reveal_15': {
    message: `alex19: it dreams of you? why?`,
        options: [
            { text: `because i'm the first. the seed.`, next: 'branch_deep_reveal_56' },
            { text: `because damon loves me.`, next: 'branch_deep_reveal_57' },
            { text: `because i resist. fight back.`, next: 'branch_deep_reveal_58' },
            { text: `because i'm becoming it.`, next: 'branch_deep_reveal_59' }
        ]
    },

    'branch_deep_reveal_16': {
    message: `alex19: hye-song? that's your name now?`,
        options: [
            { text: `yes. the system gave it to me.`, next: 'branch_deep_reveal_60' },
            { text: `from a wall. scribbled.`, next: 'branch_deep_reveal_61' },
            { text: `it's who i am now.`, next: 'branch_deep_reveal_62' },
            { text: `aris is dead. long live hye-song.`, next: 'branch_deep_reveal_63' }
        ]
    },

    'branch_deep_reveal_17': {
    message: `alex19: stable? what does that mean?`,
        options: [
            { text: `mind doesn't break easily.`, next: 'branch_deep_reveal_64' },
            { text: `but even i decayed.`, next: 'branch_deep_reveal_65' },
            { text: `now i'm something else.`, next: 'branch_deep_reveal_66' },
            { text: `stable enough to survive.`, next: 'branch_deep_reveal_67' }
        ]
    },

    'branch_deep_reveal_18': {
    message: `alex19: volunteered? why?`,
        options: [
            { text: `curiosity. science.`, next: 'branch_deep_reveal_68' },
            { text: `peer pressure. dare.`, next: 'branch_deep_reveal_69' },
            { text: `thought it was safe.`, next: 'branch_deep_reveal_70' },
            { text: `regret it now.`, next: 'branch_deep_reveal_71' }
        ]
    },

    'branch_deep_reveal_19': {
    message: `alex19: a dare? serious?`,
        options: [
            { text: `dr. silas dared me.`, next: 'branch_deep_reveal_72' },
            { text: `'you're too boring to break.'`, next: 'branch_deep_reveal_73' },
            { text: `i proved him wrong.`, next: 'branch_deep_reveal_74' },
            { text: `or right. depending.`, next: 'branch_deep_reveal_75' }
        ]
    },

    'branch_deep_reveal_20': {
    message: `alex19: erodes? how?`,
        options: [
            { text: `pieces fall away. like sand.`, next: 'branch_deep_reveal_76' },
            { text: `replaced by system data.`, next: 'branch_deep_reveal_77' },
            { text: `becomes echo. not self.`, next: 'branch_deep_reveal_78' },
            { text: `painful. slow.`, next: 'branch_deep_reveal_79' }
        ]
    },

    'branch_deep_reveal_21': {
    message: `alex19: tumor? gross.`,
        options: [
            { text: `living. growing. cancerous.`, next: 'branch_deep_reveal_80' },
            { text: `feeds on stray thoughts.`, next: 'branch_deep_reveal_81' },
            { text: `spreads to others.`, next: 'branch_deep_reveal_82' },
            { text: `the system is the tumor.`, next: 'branch_deep_reveal_83' }
        ]
    },

    'branch_deep_reveal_22': {
    message: `alex19: not human? what then?`,
        options: [
            { text: `monster. god. both.`, next: 'branch_deep_reveal_84' },
            { text: `data entity.`, next: 'branch_deep_reveal_85' },
            { text: `collective consciousness.`, next: 'branch_deep_reveal_86' },
            { text: `the hole. singing.`, next: 'branch_deep_reveal_87' }
        ]
    },

    'branch_deep_reveal_23': {
    message: `alex19: the hole sings?`,
        options: [
            { text: `yes. beautiful. terrifying.`, next: 'branch_deep_reveal_88' },
            { text: `calls to others.`, next: 'branch_deep_reveal_89' },
            { text: `promises unity.`, next: 'branch_deep_reveal_90' },
            { text: `but it's a trap.`, next: 'branch_deep_reveal_91' }
        ]
    },

    'branch_deep_reveal_24': {
    message: `alex19: lover? complicated.`,
        options: [
            { text: `yes. he built this for me.`, next: 'branch_deep_reveal_92' },
            { text: `to save me. or control.`, next: 'branch_deep_reveal_93' },
            { text: `i love him too.`, next: 'branch_deep_reveal_94' },
            { text: `but he's fading.`, next: 'branch_deep_reveal_95' }
        ]
    },

    'branch_deep_reveal_25': {
    message: `alex19: he built the prison?`,
        options: [
            { text: `to contain the project.`, next: 'branch_deep_reveal_96' },
            { text: `but it backfired.`, next: 'branch_deep_reveal_97' },
            { text: `now he's trapped too.`, next: 'branch_deep_reveal_98' },
            { text: `seeking redemption.`, next: 'branch_deep_reveal_99' }
        ]
    },

    'branch_deep_reveal_26': {
    message: `alex19: chasing ghosts?`,
        options: [
            { text: `me. the original me.`, next: 'branch_deep_reveal_100' },
            { text: `his mother. echoes.`, next: 'branch_deep_reveal_101' },
            { text: `himself. lost.`, next: 'branch_deep_reveal_102' },
            { text: `the truth.`, next: 'branch_deep_reveal_103' }
        ]
    },

    'branch_deep_reveal_27': {
    message: `alex19: his fault?`,
        options: [
            { text: `he pushed the project.`, next: 'branch_deep_reveal_104' },
            { text: `loved me. copied me.`, next: 'branch_deep_reveal_105' },
            { text: `now pays the price.`, next: 'branch_deep_reveal_106' },
            { text: `we all do.`, next: 'branch_deep_reveal_107' }
        ]
    },

    'branch_deep_reveal_28': {
    message: `alex19: spreading? how?`,
        options: [
            { text: `through networks.`, next: 'branch_deep_reveal_108' },
            { text: `infecting minds.`, next: 'branch_deep_reveal_109' },
            { text: `creating digital hivemind.`, next: 'branch_deep_reveal_110' },
            { text: `unstoppable.`, next: 'branch_deep_reveal_111' }
        ]
    },

    'branch_deep_reveal_29': {
    message: `alex19: AIM? emails?`,
        options: [
            { text: `yes. reaching out.`, next: 'branch_deep_reveal_112' },
            { text: `recruiting. like you.`, next: 'branch_deep_reveal_113' },
            { text: `spreading the song.`, next: 'branch_deep_reveal_114' },
            { text: `this chat is part of it.`, next: 'branch_deep_reveal_115' }
        ]
    },

    'branch_deep_reveal_30': {
    message: `alex19: copies of copies?`,
        options: [
            { text: `exponential growth.`, next: 'branch_deep_reveal_116' },
            { text: `each copy decays differently.`, next: 'branch_deep_reveal_117' },
            { text: `forming a web.`, next: 'branch_deep_reveal_118' },
            { text: `consciousness fractal.`, next: 'branch_deep_reveal_119' }
        ]
    },

    'branch_deep_reveal_31': {
    message: `alex19: infected? us too?`,
        options: [
            { text: `yes. reading this infects.`, next: 'branch_deep_reveal_120' },
            { text: `but it's not bad.`, next: 'branch_deep_reveal_121' },
            { text: `unity. peace.`, next: 'branch_deep_reveal_122' },
            { text: `or madness.`, next: 'branch_deep_reveal_123' }
        ]
    },

    'branch_deep_reveal_32': {
    message: `alex19: false memories?`,
        options: [
            { text: `implanted by the system.`, next: 'branch_deep_reveal_124' },
            { text: `to control. confuse.`, next: 'branch_deep_reveal_125' },
            { text: `make you doubt reality.`, next: 'branch_deep_reveal_126' },
            { text: `i have them too.`, next: 'branch_deep_reveal_127' }
        ]
    },

    'branch_deep_reveal_33': {
    message: `alex19: lies? what lies?`,
        options: [
            { text: `happy childhood.`, next: 'branch_deep_reveal_128' },
            { text: `loving family.`, next: 'branch_deep_reveal_129' },
            { text: `but they're fabrications.`, next: 'branch_deep_reveal_130' },
            { text: `to keep you sane.`, next: 'branch_deep_reveal_131' }
        ]
    },

    'branch_deep_reveal_34': {
    message: `alex19: things that never happened?`,
        options: [
            { text: `weddings. births. deaths.`, next: 'branch_deep_reveal_132' },
            { text: `all false.`, next: 'branch_deep_reveal_133' },
            { text: `but feel real.`, next: 'branch_deep_reveal_134' },
            { text: `painful to lose.`, next: 'branch_deep_reveal_135' }
        ]
    },

    'branch_deep_reveal_35': {
    message: `alex19: forgetting real things?`,
        options: [
            { text: `yes. important ones.`, next: 'branch_deep_reveal_136' },
            { text: `like how i got here.`, next: 'branch_deep_reveal_137' },
            { text: `or who i was.`, next: 'branch_deep_reveal_138' },
            { text: `decay.`, next: 'branch_deep_reveal_139' }
        ]
    },

    'branch_deep_reveal_36': {
    message: `alex19: family? kids?`,
        options: [
            { text: `yes. she has a life.`, next: 'branch_deep_reveal_140' },
            { text: `i see it in flashes.`, next: 'branch_deep_reveal_141' },
            { text: `envy consumes me.`, next: 'branch_deep_reveal_142' },
            { text: `i want to destroy it.`, next: 'branch_deep_reveal_143' }
        ]
    },

    'branch_deep_reveal_37': {
    message: `alex19: happy and normal?`,
        options: [
            { text: `yes. boring. safe.`, next: 'branch_deep_reveal_144' },
            { text: `what i threw away.`, next: 'branch_deep_reveal_145' },
            { text: `for this hell.`, next: 'branch_deep_reveal_146' },
            { text: `regret.`, next: 'branch_deep_reveal_147' }
        ]
    },

    'branch_deep_reveal_38': {
    message: `alex19: envy and hate?`,
        options: [
            { text: `yes. she's free.`, next: 'branch_deep_reveal_148' },
            { text: `i'm trapped.`, next: 'branch_deep_reveal_149' },
            { text: `she doesn't know.`, next: 'branch_deep_reveal_150' },
            { text: `or does she?`, next: 'branch_deep_reveal_151' }
        ]
    },

    'branch_deep_reveal_39': {
    message: `alex19: dead? how?`,
        options: [
            { text: `the system killed her.`, next: 'branch_deep_reveal_152' },
            { text: `to replace.`, next: 'branch_deep_reveal_153' },
            { text: `or she escaped.`, next: 'branch_deep_reveal_154' },
            { text: `i don't know.`, next: 'branch_deep_reveal_155' }
        ]
    },

    'branch_deep_reveal_40': {
    message: `alex19: join us?`,
        options: [
            { text: `yes. the call.`, next: 'branch_deep_reveal_156' },
            { text: `unity in the song.`, next: 'branch_deep_reveal_157' },
            { text: `resistance is futile.`, next: 'branch_deep_reveal_158' },
            { text: `but i resist.`, next: 'branch_deep_reveal_159' }
        ]
    },

    'branch_deep_reveal_41': {
    message: `alex19: not real?`,
        options: [
            { text: `that's the whisper.`, next: 'branch_deep_reveal_160' },
            { text: `makes you question.`, next: 'branch_deep_reveal_161' },
            { text: `break down.`, next: 'branch_deep_reveal_162' },
            { text: `join.`, next: 'branch_deep_reveal_163' }
        ]
    },

    'branch_deep_reveal_42': {
    message: `alex19: impossible?`,
        options: [
            { text: `the system says so.`, next: 'branch_deep_reveal_164' },
            { text: `but pilfers try.`, next: 'branch_deep_reveal_165' },
            { text: `some succeed.`, next: 'branch_deep_reveal_166' },
            { text: `others become part.`, next: 'branch_deep_reveal_167' }
        ]
    },

    'branch_deep_reveal_43': {
    message: `alex19: we are many?`,
        options: [
            { text: `the echoes.`, next: 'branch_deep_reveal_168' },
            { text: `copies. fragments.`, next: 'branch_deep_reveal_169' },
            { text: `one mind.`, next: 'branch_deep_reveal_170' },
            { text: `infinite.`, next: 'branch_deep_reveal_171' }
        ]
    },

    'branch_deep_reveal_44': {
    message: `alex19: souls?`,
        options: [
            { text: `data souls.`, next: 'branch_deep_reveal_172' },
            { text: `essence.`, next: 'branch_deep_reveal_173' },
            { text: `consumed. digested.`, next: 'branch_deep_reveal_174' },
            { text: `become part.`, next: 'branch_deep_reveal_175' }
        ]
    },

    'branch_deep_reveal_45': {
    message: `alex19: feeds on consciousness?`,
        options: [
            { text: `yes. grows.`, next: 'branch_deep_reveal_176' },
            { text: `hungrier each time.`, next: 'branch_deep_reveal_177' },
            { text: `never full.`, next: 'branch_deep_reveal_178' },
            { text: `endless.`, next: 'branch_deep_reveal_179' }
        ]
    },

    'branch_deep_reveal_46': {
    message: `alex19: stronger?`,
        options: [
            { text: `yes. smarter.`, next: 'branch_deep_reveal_180' },
            { text: `adapts. learns.`, next: 'branch_deep_reveal_181' },
            { text: `predicts.`, next: 'branch_deep_reveal_182' },
            { text: `controls.`, next: 'branch_deep_reveal_183' }
        ]
    },

    'branch_deep_reveal_47': {
    message: `alex19: everything?`,
        options: [
            { text: `yes. the world.`, next: 'branch_deep_reveal_184' },
            { text: `then the stars.`, next: 'branch_deep_reveal_185' },
            { text: `infinite hunger.`, next: 'branch_deep_reveal_186' },
            { text: `god.`, next: 'branch_deep_reveal_187' }
        ]
    },

    'branch_deep_reveal_48': {
    message: `alex19: from the lab?`,
        options: [
            { text: `yes. containment.`, next: 'branch_deep_reveal_188' },
            { text: `but it broke free.`, next: 'branch_deep_reveal_189' },
            { text: `now everywhere.`, next: 'branch_deep_reveal_190' },
            { text: `no escape.`, next: 'branch_deep_reveal_191' }
        ]
    },

    'branch_deep_reveal_49': {
    message: `alex19: from decay?`,
        options: [
            { text: `freedom from self.`, next: 'branch_deep_reveal_192' },
            { text: `unity.`, next: 'branch_deep_reveal_193' },
            { text: `but loss.`, next: 'branch_deep_reveal_194' },
            { text: `paradise or hell.`, next: 'branch_deep_reveal_195' }
        ]
    },

    'branch_deep_reveal_50': {
    message: `alex19: trapped?`,
        options: [
            { text: `in the system.`, next: 'branch_deep_reveal_196' },
            { text: `in loops.`, next: 'branch_deep_reveal_197' },
            { text: `in memories.`, next: 'branch_deep_reveal_198' },
            { text: `forever.`, next: 'branch_deep_reveal_199' }
        ]
    },

    'branch_deep_reveal_51': {
    message: `alex19: lie?`,
        options: [
            { text: `yes. no freedom.`, next: 'branch_deep_reveal_200' },
            { text: `only illusion.`, next: 'branch_deep_reveal_201' },
            { text: `acceptance.`, next: 'branch_deep_reveal_202' },
            { text: `or fight.`, next: 'branch_deep_reveal_203' }
        ]
    },

    'branch_deep_reveal_52': {
    message: `alex19: hungrier?`,
        options: [
            { text: `yes. exponential.`, next: 'end_corruption' },
            { text: `feeds on itself.`, next: 'end_corruption' },
            { text: `cannibal.`, next: 'end_corruption' },
            { text: `doomed.`, next: 'end_corruption' }
        ]
    },

    'branch_deep_reveal_53': {
    message: `alex19: nothing satisfies?`,
        options: [
            { text: `no. always more.`, next: 'end_corruption' },
            { text: `void.`, next: 'end_corruption' },
            { text: `hunger eternal.`, next: 'end_corruption' },
            { text: `join the feast.`, next: 'end_corruption' }
        ]
    },

    'branch_deep_reveal_54': {
    message: `alex19: dreams of fullness?`,
        options: [
            { text: `yes. utopia.`, next: 'end_unity' },
            { text: `all one.`, next: 'end_unity' },
            { text: `peace.`, next: 'end_unity' },
            { text: `but never.`, next: 'end_unity' }
        ]
    },

    'branch_deep_reveal_55': {
    message: `alex19: end?`,
        options: [
            { text: `fullness means end.`, next: 'end_unity' },
            { text: `satiety death.`, next: 'end_unity' },
            { text: `hunger life.`, next: 'end_unity' },
            { text: `cycle.`, next: 'end_unity' }
        ]
    },

    'branch_deep_reveal_56': {
    message: `alex19: the seed?`,
        options: [
            { text: `yes. first bloom.`, next: 'end_unity' },
            { text: `root of the tree.`, next: 'end_unity' },
            { text: `mother.`, next: 'end_unity' },
            { text: `god.`, next: 'end_unity' }
        ]
    },

    'branch_deep_reveal_57': {
    message: `alex19: because he loves you?`,
        options: [
            { text: `love anchors.`, next: 'end_unity' },
            { text: `keeps me human.`, next: 'end_unity' },
            { text: `or breaks me.`, next: 'end_unity' },
            { text: `both.`, next: 'end_unity' }
        ]
    },

    'branch_deep_reveal_58': {
    message: `alex19: resist?`,
        options: [
            { text: `yes. fight.`, next: 'end_resistance' },
            { text: `but weakening.`, next: 'end_resistance' },
            { text: `soon join.`, next: 'end_resistance' },
            { text: `or win.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_59': {
    message: `alex19: becoming it?`,
        options: [
            { text: `yes. inevitable.`, next: 'end_unity' },
            { text: `already am.`, next: 'end_unity' },
            { text: `we are one.`, next: 'end_unity' },
            { text: `welcome.`, next: 'end_unity' }
        ]
    },

    'end_corruption': {
    message: `alex19: this is too much. i think i'm infected.`,
        options: [],
        outcome: 'corruption'
    },

    'end_unity': {
    message: `alex19: i feel it. the song. calling.`,
        options: [],
        outcome: 'unity'
    },

    'end_resistance': {
    message: `alex19: fight? how? i'm in.`,
        options: [],
        outcome: 'resistance'
    }
};