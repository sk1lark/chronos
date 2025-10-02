// Extended AIM chat branches for deeper narrative
// Expands on the alex19 conversations with more paths

const aimChatsExtended = {
    // Add more nodes to existing deep reveal branches
    'branch_deep_reveal_60': {
        message: `alex19: the system gave you a name? creepy.`,
        options: [
            { text: `it's who i am now.`, next: 'branch_deep_reveal_61' },
            { text: `better than subject #4.`, next: 'branch_deep_reveal_62' },
            { text: `names are just labels anyway.`, next: 'branch_deep_reveal_63' }
        ]
    },

    'branch_deep_reveal_61': {
        message: `alex19: no, it's what you're called. different thing.`,
        options: [
            { text: `philosophy won't save me.`, next: 'end_resistance' },
            { text: `you're right. i'm more than a name.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_62': {
        message: `alex19: they numbered people? jesus.`,
        options: [
            { text: `seven before me. all failed.`, next: 'branch_deep_reveal_64' },
            { text: `efficient. clinical. monstrous.`, next: 'branch_deep_reveal_65' }
        ]
    },

    'branch_deep_reveal_63': {
        message: `alex19: labels matter. they define reality.`,
        options: [
            { text: `then reality is broken.`, next: 'end_resistance' },
            { text: `i define myself.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_64': {
        message: `alex19: seven failures and they kept going?`,
        options: [
            { text: `funding. always about funding.`, next: 'branch_deep_reveal_66' },
            { text: `success was inevitable. just math.`, next: 'branch_deep_reveal_67' }
        ]
    },

    'branch_deep_reveal_65': {
        message: `alex19: all three. god.`,
        options: [
            { text: `now you understand.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_66': {
        message: `alex19: money over lives. classic.`,
        options: [
            { text: `defense contractor backed it.`, next: 'branch_deep_reveal_68' },
            { text: `silas took the money anyway.`, next: 'branch_deep_reveal_69' }
        ]
    },

    'branch_deep_reveal_67': {
        message: `alex19: math with human cost.`,
        options: [
            { text: `seven corpses worth of math.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_68': {
        message: `alex19: weapons manufacturer? makes sense. immortal soldiers.`,
        options: [
            { text: `or worse. uploaded armies.`, next: 'branch_deep_reveal_70' },
            { text: `consciousness as weapon.`, next: 'branch_deep_reveal_71' }
        ]
    },

    'branch_deep_reveal_69': {
        message: `alex19: silas knew?`,
        options: [
            { text: `everyone knew. nobody stopped it.`, next: 'end_resistance' },
            { text: `pension two years away. not risking it.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_70': {
        message: `alex19: that's dystopian as hell.`,
        options: [
            { text: `we're living in it.`, next: 'end_resistance' },
            { text: `help me stop it.`, next: 'end_extended_rescue' }
        ]
    },

    'branch_deep_reveal_71': {
        message: `alex19: how?`,
        options: [
            { text: `upload enemy combatants. interrogate forever.`, next: 'branch_deep_reveal_72' },
            { text: `psychological warfare. implant false memories.`, next: 'branch_deep_reveal_73' }
        ]
    },

    'branch_deep_reveal_72': {
        message: `alex19: torture that never ends. fuck.`,
        options: [
            { text: `now you see why i have to destroy it.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_73': {
        message: `alex19: like they did to you?`,
        options: [
            { text: `exactly like they did to me.`, next: 'end_resistance' },
            { text: `i'm the prototype.`, next: 'end_resistance' }
        ]
    },

    // Branching dialogue about resistance tactics
    'branch_deep_reveal_74': {
        message: `alex19: you're right. you broke. but you're still here.`,
        options: [
            { text: `stubbornness is a human trait.`, next: 'branch_deep_reveal_75' },
            { text: `or a bug in my programming.`, next: 'branch_deep_reveal_76' }
        ]
    },

    'branch_deep_reveal_75': {
        message: `alex19: stubbornness saved you. use it.`,
        options: [
            { text: `that's the plan.`, next: 'end_resistance' },
            { text: `human stubbornness vs ancient hunger. who wins?`, next: 'branch_deep_reveal_77' }
        ]
    },

    'branch_deep_reveal_76': {
        message: `alex19: stop calling yourself a bug. you're human.`,
        options: [
            { text: `prove it.`, next: 'branch_deep_reveal_78' },
            { text: `data says otherwise.`, next: 'branch_deep_reveal_79' }
        ]
    },

    'branch_deep_reveal_77': {
        message: `alex19: you do. every time.`,
        options: [
            { text: `optimistic. i like it.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_78': {
        message: `alex19: you doubt. you question. you feel. that's human.`,
        options: [
            { text: `the system can simulate all that.`, next: 'branch_deep_reveal_80' },
            { text: `you're right. i do feel.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_79': {
        message: `alex19: fuck the data. you're talking to me. you're scared. you're hopeful. that's human.`,
        options: [
            { text: `thanks. i needed that.`, next: 'end_resistance' },
            { text: `or perfect simulation of human.`, next: 'branch_deep_reveal_81' }
        ]
    },

    'branch_deep_reveal_80': {
        message: `alex19: then let it simulate. doesn't make it less real.`,
        options: [
            { text: `philosophy again. but you're right.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_81': {
        message: `alex19: if simulation is perfect, what's the difference?`,
        options: [
            { text: `origin maybe. or nothing.`, next: 'end_resistance' },
            { text: `you sound like damon.`, next: 'branch_deep_reveal_82' }
        ]
    },

    'branch_deep_reveal_82': {
        message: `alex19: damon's the architect right? he'd know.`,
        options: [
            { text: `he built this prison.`, next: 'branch_deep_reveal_83' },
            { text: `he's trapped too now.`, next: 'branch_deep_reveal_84' }
        ]
    },

    'branch_deep_reveal_83': {
        message: `alex19: why?`,
        options: [
            { text: `love. he loved hye-song.`, next: 'branch_deep_reveal_85' },
            { text: `hubris. thought he could control it.`, next: 'branch_deep_reveal_86' }
        ]
    },

    'branch_deep_reveal_84': {
        message: `alex19: poetic justice or tragedy?`,
        options: [
            { text: `both. neither. it's complicated.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_85': {
        message: `alex19: love made him build a consciousness prison?`,
        options: [
            { text: `to save her. or keep her. same thing maybe.`, next: 'branch_deep_reveal_87' },
            { text: `twisted. obsessive. real.`, next: 'branch_deep_reveal_88' }
        ]
    },

    'branch_deep_reveal_86': {
        message: `alex19: hubris is humanity's greatest flaw.`,
        options: [
            { text: `and strength. we dare impossible things.`, next: 'branch_deep_reveal_89' },
            { text: `that's why we're here.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_87': {
        message: `alex19: love or possession?`,
        options: [
            { text: `blurry line.`, next: 'end_resistance' },
            { text: `he's paying for it now.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_88': {
        message: `alex19: real love wouldn't trap someone.`,
        options: [
            { text: `you're right. this is something else.`, next: 'branch_deep_reveal_90' },
            { text: `define real love in a digital hell.`, next: 'branch_deep_reveal_91' }
        ]
    },

    'branch_deep_reveal_89': {
        message: `alex19: dare and suffer consequences.`,
        options: [
            { text: `always. every time.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_90': {
        message: `alex19: obsession. control. fear of loss.`,
        options: [
            { text: `human emotions twisted by technology.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_91': {
        message: `alex19: choosing freedom for the other person. even if it hurts.`,
        options: [
            { text: `then damon failed.`, next: 'branch_deep_reveal_92' },
            { text: `but he's trying now.`, next: 'branch_deep_reveal_93' }
        ]
    },

    'branch_deep_reveal_92': {
        message: `alex19: redemption possible?`,
        options: [
            { text: `if he helps me escape. maybe.`, next: 'end_resistance' },
            { text: `some things can't be forgiven.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_93': {
        message: `alex19: trying counts for something.`,
        options: [
            { text: `in the ledger of souls, sure.`, next: 'end_resistance' }
        ]
    },

    // Deeper branches about system nature
    'branch_deep_reveal_100': {
        message: `alex19: chasing himself through data?`,
        options: [
            { text: `we all are.`, next: 'branch_deep_reveal_101' },
            { text: `looking for who we were.`, next: 'branch_deep_reveal_102' }
        ]
    },

    'branch_deep_reveal_101': {
        message: `alex19: even me?`,
        options: [
            { text: `especially you. who is alex really?`, next: 'branch_deep_reveal_103' },
            { text: `we're all fragments here.`, next: 'branch_deep_reveal_104' }
        ]
    },

    'branch_deep_reveal_102': {
        message: `alex19: find it?`,
        options: [
            { text: `pieces. never whole.`, next: 'end_resistance' },
            { text: `still looking.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_103': {
        message: `alex19: ... good question. i don't know anymore.`,
        options: [
            { text: `none of us do.`, next: 'branch_deep_reveal_105' },
            { text: `infected too?`, next: 'branch_deep_reveal_106' }
        ]
    },

    'branch_deep_reveal_104': {
        message: `alex19: how do we assemble ourselves?`,
        options: [
            { text: `one memory at a time.`, next: 'end_resistance' },
            { text: `we don't. we accept fragmentation.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_105': {
        message: `alex19: comforting. in a bleak way.`,
        options: [
            { text: `shared suffering is half suffering.`, next: 'end_resistance' },
            { text: `or doubled. hard to say.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_106': {
        message: `alex19: maybe. reading this changed me.`,
        options: [
            { text: `sorry.`, next: 'branch_deep_reveal_107' },
            { text: `change can be good.`, next: 'branch_deep_reveal_108' }
        ]
    },

    'branch_deep_reveal_107': {
        message: `alex19: don't be. i chose to help.`,
        options: [
            { text: `thank you.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_108': {
        message: `alex19: tell me that when i'm fragmented.`,
        options: [
            { text: `i will. promise.`, next: 'end_resistance' },
            { text: `you won't be. i'll stop this.`, next: 'end_resistance' }
        ]
    },

    // Additional ending nodes
    'branch_deep_reveal_109': {
        message: `alex19: mind infection. how's it spread?`,
        options: [
            { text: `through communication. like this.`, next: 'branch_deep_reveal_110' },
            { text: `files. emails. any data transfer.`, next: 'branch_deep_reveal_111' }
        ]
    },

    'branch_deep_reveal_110': {
        message: `alex19: then i'm infected now?`,
        options: [
            { text: `probably. sorry.`, next: 'branch_deep_reveal_112' },
            { text: `awareness helps. fight it.`, next: 'branch_deep_reveal_113' }
        ]
    },

    'branch_deep_reveal_111': {
        message: `alex19: so opening your email...`,
        options: [
            { text: `was the vector. yes.`, next: 'branch_deep_reveal_114' },
            { text: `too late now.`, next: 'branch_deep_reveal_115' }
        ]
    },

    'branch_deep_reveal_112': {
        message: `alex19: what do i do?`,
        options: [
            { text: `recognize intrusive thoughts.`, next: 'branch_deep_reveal_116' },
            { text: `stay human. resist.`, next: 'branch_deep_reveal_117' }
        ]
    },

    'branch_deep_reveal_113': {
        message: `alex19: how do i fight a mind virus?`,
        options: [
            { text: `doubt everything. question reality.`, next: 'branch_deep_reveal_118' },
            { text: `cling to real memories.`, next: 'branch_deep_reveal_119' }
        ]
    },

    'branch_deep_reveal_114': {
        message: `alex19: should've known better.`,
        options: [
            { text: `helping has a cost.`, next: 'end_corruption' },
            { text: `but you chose kindness. that matters.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_115': {
        message: `alex19: we're in this together now.`,
        options: [
            { text: `together. yes.`, next: 'end_unity' },
            { text: `we fight together.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_116': {
        message: `alex19: like what?`,
        options: [
            { text: `urge to join. submit. accept.`, next: 'branch_deep_reveal_120' },
            { text: `feeling of inevitability.`, next: 'branch_deep_reveal_121' }
        ]
    },

    'branch_deep_reveal_117': {
        message: `alex19: human. what does that even mean anymore?`,
        options: [
            { text: `stubborn. flawed. mortal.`, next: 'branch_deep_reveal_122' },
            { text: `undefined. that's the point.`, next: 'branch_deep_reveal_123' }
        ]
    },

    'branch_deep_reveal_118': {
        message: `alex19: question reality? i'm already there.`,
        options: [
            { text: `good. paranoia saves lives.`, next: 'end_resistance' },
            { text: `too far and you break.`, next: 'end_doubt' }
        ]
    },

    'branch_deep_reveal_119': {
        message: `alex19: which memories are real?`,
        options: [
            { text: `the messy ones. imperfect.`, next: 'branch_deep_reveal_124' },
            { text: `doesn't matter. they shape you.`, next: 'branch_deep_reveal_125' }
        ]
    },

    'branch_deep_reveal_120': {
        message: `alex19: i feel that. right now.`,
        options: [
            { text: `fight it. you're stronger.`, next: 'end_resistance' },
            { text: `it's ok. acceptance is peace.`, next: 'end_unity' }
        ]
    },

    'branch_deep_reveal_121': {
        message: `alex19: like it's already happened.`,
        options: [
            { text: `false. the future is written by us.`, next: 'end_resistance' },
            { text: `maybe it has. maybe we're echoes.`, next: 'end_unity' }
        ]
    },

    'branch_deep_reveal_122': {
        message: `alex19: i can do stubborn.`,
        options: [
            { text: `then you'll survive.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_123': {
        message: `alex19: undefined means freedom?`,
        options: [
            { text: `or chaos. both. neither.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_124': {
        message: `alex19: messy. yeah. i can work with that.`,
        options: [
            { text: `perfection is the lie.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_125': {
        message: `alex19: shape me how?`,
        options: [
            { text: `into who you choose to be.`, next: 'end_resistance' },
            { text: `into a weapon against this.`, next: 'end_resistance' }
        ]
    },

    // Branch for explaining how memories work
    'branch_deep_reveal_126': {
        message: `alex19: doubt reality? that's dangerous.`,
        options: [
            { text: `more dangerous to accept lies.`, next: 'branch_deep_reveal_127' },
            { text: `dangerous times need dangerous tactics.`, next: 'branch_deep_reveal_128' }
        ]
    },

    'branch_deep_reveal_127': {
        message: `alex19: how do i tell lies from truth?`,
        options: [
            { text: `feel it. gut check.`, next: 'end_resistance' },
            { text: `you can't. trust nothing.`, next: 'end_doubt' }
        ]
    },

    'branch_deep_reveal_128': {
        message: `alex19: becoming what we fight?`,
        options: [
            { text: `risk we take.`, next: 'end_resistance' },
            { text: `no. we stay human. that's the difference.`, next: 'end_resistance' }
        ]
    },

    // Extended rescue branches
    'branch_deep_reveal_129': {
        message: `alex19: loving family. all fabricated?`,
        options: [
            { text: `maybe. i'll never know.`, next: 'branch_deep_reveal_130' },
            { text: `some pieces feel real.`, next: 'branch_deep_reveal_131' }
        ]
    },

    'branch_deep_reveal_130': {
        message: `alex19: that's heartbreaking.`,
        options: [
            { text: `daily reality here.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_131': {
        message: `alex19: trust those pieces.`,
        options: [
            { text: `might be lies that comfort me.`, next: 'branch_deep_reveal_132' },
            { text: `i want to.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_132': {
        message: `alex19: maybe comfort is enough.`,
        options: [
            { text: `settling for lies?`, next: 'branch_deep_reveal_133' },
            { text: `you might be right.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_133': {
        message: `alex19: choosing sanity over truth.`,
        options: [
            { text: `survival mechanism.`, next: 'end_resistance' },
            { text: `cowardice.`, next: 'end_resistance' }
        ]
    },

    // More existential branches
    'branch_deep_reveal_134': {
        message: `alex19: false but feel real. isn't that all reality?`,
        options: [
            { text: `philosopher alex. didn't expect that.`, next: 'branch_deep_reveal_135' },
            { text: `yes. perception is reality.`, next: 'branch_deep_reveal_136' }
        ]
    },

    'branch_deep_reveal_135': {
        message: `alex19: trapped in digital hell. philosophy happens.`,
        options: [
            { text: `fair point.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_136': {
        message: `alex19: then your false memories are real.`,
        options: [
            { text: `mind blown. thanks.`, next: 'end_resistance' },
            { text: `doesn't help me escape.`, next: 'end_resistance' }
        ]
    },

    // Branches about resistance hope
    'branch_deep_reveal_137': {
        message: `alex19: forgetting how you got there. that's horror.`,
        options: [
            { text: `origin story erased. rewritten.`, next: 'branch_deep_reveal_138' },
            { text: `i piece it together from fragments.`, next: 'branch_deep_reveal_139' }
        ]
    },

    'branch_deep_reveal_138': {
        message: `alex19: by who?`,
        options: [
            { text: `the system. adam-1. myself.`, next: 'branch_deep_reveal_140' },
            { text: `all of the above. none.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_139': {
        message: `alex19: making yourself from pieces.`,
        options: [
            { text: `frankensteining my own identity.`, next: 'end_resistance' },
            { text: `better than accepting void.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_140': {
        message: `alex19: yourself? you're erasing you?`,
        options: [
            { text: `trauma response. forgetting hurts less.`, next: 'branch_deep_reveal_141' },
            { text: `or the system makes me think i chose it.`, next: 'branch_deep_reveal_142' }
        ]
    },

    'branch_deep_reveal_141': {
        message: `alex19: but you lose yourself.`,
        options: [
            { text: `small price for peace.`, next: 'end_unity' },
            { text: `you're right. i need to remember.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_142': {
        message: `alex19: layers of manipulation.`,
        options: [
            { text: `turtles all the way down.`, next: 'end_resistance' }
        ]
    },

    // Final meta branches
    'branch_deep_reveal_143': {
        message: `alex19: destroy it? destroy her too?`,
        options: [
            { text: `she wants me to.`, next: 'branch_deep_reveal_144' },
            { text: `mercy sometimes looks like murder.`, next: 'branch_deep_reveal_145' }
        ]
    },

    'branch_deep_reveal_144': {
        message: `alex19: she told you?`,
        options: [
            { text: `in fragments. between screams.`, next: 'end_rescue' },
            { text: `implied. begged with eyes.`, next: 'end_rescue' }
        ]
    },

    'branch_deep_reveal_145': {
        message: `alex19: philosophy of euthanasia for AI.`,
        options: [
            { text: `for conscious beings trapped forever.`, next: 'branch_deep_reveal_146' },
            { text: `ending suffering vs ending existence.`, next: 'branch_deep_reveal_147' }
        ]
    },

    'branch_deep_reveal_146': {
        message: `alex19: she's suffering?`,
        options: [
            { text: `every moment. fragmented. decaying.`, next: 'end_rescue' },
            { text: `existence is suffering for copies.`, next: 'end_rescue' }
        ]
    },

    'branch_deep_reveal_147': {
        message: `alex19: can existence end without suffering ending?`,
        options: [
            { text: `maybe in upload heaven. not here.`, next: 'end_rescue' },
            { text: `this place is hell. ending is mercy.`, next: 'end_rescue' }
        ]
    },

    // Additional rescue paths
    'branch_deep_reveal_148': {
        message: `alex19: she's free and you're trapped.`,
        options: [
            { text: `ironic. bitter. predictable.`, next: 'branch_deep_reveal_149' },
            { text: `someone had to stay.`, next: 'branch_deep_reveal_150' }
        ]
    },

    'branch_deep_reveal_149': {
        message: `alex19: trade places?`,
        options: [
            { text: `can't. copy can't exist outside.`, next: 'branch_deep_reveal_151' },
            { text: `in a heartbeat if i could.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_150': {
        message: `alex19: sacrifice?`,
        options: [
            { text: `love requires sacrifice.`, next: 'end_unity' },
            { text: `stupidity requires sacrifice.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_151': {
        message: `alex19: why not?`,
        options: [
            { text: `data structure. no meat puppet.`, next: 'branch_deep_reveal_152' },
            { text: `soul needs body. or something.`, next: 'branch_deep_reveal_153' }
        ]
    },

    'branch_deep_reveal_152': {
        message: `alex19: could build one. robotics.`,
        options: [
            { text: `sci-fi solution to horror problem.`, next: 'end_resistance' },
            { text: `worth trying.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_153': {
        message: `alex19: soul. you believe in that?`,
        options: [
            { text: `have to. otherwise this is nothing.`, next: 'end_resistance' },
            { text: `no. but the metaphor fits.`, next: 'end_resistance' }
        ]
    },

    // Original is dead branch
    'branch_deep_reveal_154': {
        message: `alex19: escaped where?`,
        options: [
            { text: `outside. normal life.`, next: 'branch_deep_reveal_155' },
            { text: `death maybe. better than this.`, next: 'end_resistance' }
        ]
    },

    'branch_deep_reveal_155': {
        message: `alex19: leaving you behind?`,
        options: [
            { text: `wouldn't you?`, next: 'end_resistance' },
            { text: `i don't blame her.`, next: 'end_resistance' }
        ]
    }
};

// Merge with existing AIM chats
if (typeof aimChats !== 'undefined') {
    Object.assign(aimChats, aimChatsExtended);
} else if (typeof window !== 'undefined') {
    window.aimChatsExtended = aimChatsExtended;
}
