import React, { useState } from 'react';
import { Search } from 'lucide-react';

// Simplified emoji data
const EMOJI_DATA = {
  '😀': 'grinning',
  '😃': 'smiley',
  '😄': 'smile',
  '😁': 'grin',
  '😆': 'laughing',
  '😅': 'sweat_smile',
  '😂': 'joy',
  '🤣': 'rofl',
  '😊': 'blush',
  '😇': 'innocent',
  '🙂': 'slightly_smiling',
  '🙃': 'upside_down',
  '😉': 'wink',
  '😌': 'relieved',
  '😍': 'heart_eyes',
  '🥰': 'smiling_face_with_hearts',
  '😘': 'kissing_heart',
  '😗': 'kissing',
  '😙': 'kissing_smiling_eyes',
  '😚': 'kissing_closed_eyes',
  '😋': 'yum',
  '😛': 'stuck_out_tongue',
  '😝': 'stuck_out_tongue_winking_eye',
  '😜': 'stuck_out_tongue_closed_eyes',
  '🤪': 'zany',
  '🤨': 'raised_eyebrow',
  '🧐': 'monocle',
  '🤓': 'nerd',
  '😎': 'sunglasses',
  '🤩': 'star_struck',
  '🥳': 'partying',
  '😏': 'smirk',
  '😒': 'unamused',
  '😞': 'disappointed',
  '😔': 'pensive',
  '😟': 'worried',
  '😕': 'slightly_frowning',
  '🙁': 'frowning',
  '☹️': 'frowning2',
  '😣': 'persevere',
  '😖': 'confounded',
  '😫': 'tired',
  '😩': 'weary',
  '🥺': 'pleading',
  '😢': 'cry',
  '😭': 'sob',
  '😤': 'triumph',
  '😠': 'angry',
  '😡': 'rage',
  '🤬': 'swearing',
  '🤯': 'exploding_head',
  '😳': 'flushed',
  '🥵': 'hot',
  '🥶': 'cold',
  '😱': 'scream',
  '😨': 'fearful',
  '😰': 'cold_sweat',
  '😥': 'disappointed_relieved',
  '😓': 'sweat',
  '🤗': 'hugging',
  '🤔': 'thinking',
  '🤭': 'hand_over_mouth',
  '🤫': 'shushing',
  '🤥': 'lying',
  '😶': 'no_mouth',
  '😐': 'neutral',
  '😑': 'expressionless',
  '😬': 'grimacing',
  '🙄': 'rolling_eyes',
  '😯': 'hushed',
  '😦': 'frowning_open_mouth',
  '😧': 'anguished',
  '😮': 'open_mouth',
  '😲': 'astonished',
  '🥱': 'yawning',
  '😴': 'sleeping',
  '🤤': 'drooling',
  '😪': 'sleepy',
  '😵': 'dizzy',
  '🤐': 'zipper_mouth',
  '🥴': 'woozy',
  '🤢': 'nauseated',
  '🤮': 'vomiting',
  '🤧': 'sneezing',
  '😷': 'mask',
  '🤒': 'thermometer_face',
  '🤕': 'head_bandage',
  '🤑': 'money_mouth',
  '🤠': 'cowboy',
  '😈': 'imp',
  '👿': 'angry_devil',
  '👹': 'ogre',
  '👺': 'goblin',
  '🤡': 'clown',
  '💩': 'poop',
  '👻': 'ghost',
  '💀': 'skull',
  '☠️': 'skull_crossbones',
  '👽': 'alien',
  '👾': 'space_invader',
  '🤖': 'robot',
  '🎃': 'jack_o_lantern',
  '😺': 'smiley_cat',
  '😸': 'smile_cat',
  '😹': 'joy_cat',
  '😻': 'heart_eyes_cat',
  '😼': 'smirk_cat',
  '😽': 'kissing_cat',
  '🙀': 'scream_cat',
  '😿': 'crying_cat',
  '😾': 'pouting_cat',
  '👶': 'baby',
  '👧': 'girl',
  '🧒': 'child',
  '👦': 'boy',
  '👩': 'woman',
  '🧑': 'person',
  '👨': 'man',
  '👵': 'older_woman',
  '🧓': 'older_person',
  '👴': 'older_man',
  '👲': 'man_with_chinese_cap',
  '👳': 'person_wearing_turban',
  '👮': 'police_officer',
  '👷': 'construction_worker',
  '💂': 'guard',
  '🕵️': 'detective',
  '👩‍⚕️': 'woman_health_worker',
  '👨‍⚕️': 'man_health_worker',
  '👩‍🌾': 'woman_farmer',
  '👨‍🌾': 'man_farmer',
  '👩‍🍳': 'woman_cook',
  '👨‍🍳': 'man_cook',
  '👩‍🎓': 'woman_student',
  '👨‍🎓': 'man_student',
  '👩‍🎤': 'woman_singer',
  '👨‍🎤': 'man_singer',
  '👩‍🏫': 'woman_teacher',
  '👨‍🏫': 'man_teacher',
  '👩‍🏭': 'woman_factory_worker',
  '👨‍🏭': 'man_factory_worker',
  '👩‍💻': 'woman_technologist',
  '👨‍💻': 'man_technologist',
  '👩‍💼': 'woman_office_worker',
  '👨‍💼': 'man_office_worker',
  '👩‍🔧': 'woman_mechanic',
  '👨‍🔧': 'man_mechanic',
  '👩‍🔬': 'woman_scientist',
  '👨‍🔬': 'man_scientist',
  '👩‍🎨': 'woman_artist',
  '👨‍🎨': 'man_artist',
  '👩‍🚒': 'woman_firefighter',
  '👨‍🚒': 'man_firefighter',
  '👩‍✈️': 'woman_pilot',
  '👨‍✈️': 'man_pilot',
  '👩‍🚀': 'woman_astronaut',
  '👨‍🚀': 'man_astronaut',
  '👩‍⚖️': 'woman_judge',
  '👨‍⚖️': 'man_judge',
  '💆': 'massage',
  '💇': 'haircut',
  '🚶': 'walking',
  '🏃': 'running',
  '💃': 'dancing_woman',
  '🕺': 'dancing_man',
  '👯': 'dancing_women',
  '👭': 'two_women_holding_hands',
  '👫': 'couple',
  '👬': 'two_men_holding_hands',
  '💏': 'kiss',
  '💑': 'couple_with_heart',
  '👪': 'family',
  '👤': 'bust_in_silhouette',
  '👥': 'busts_in_silhouette',
  '🫂': 'people_hugging',
  '👣': 'footprints',
  '🏻': 'light_skin_tone',
  '🏼': 'medium_light_skin_tone',
  '🏽': 'medium_skin_tone',
  '🏾': 'medium_dark_skin_tone',
  '🏿': 'dark_skin_tone',
  '❤️': 'red_heart',
  '🧡': 'orange_heart',
  '💛': 'yellow_heart',
  '💚': 'green_heart',
  '💙': 'blue_heart',
  '💜': 'purple_heart',
  '🖤': 'black_heart',
  '🤍': 'white_heart',
  '🤎': 'brown_heart',
  '💔': 'broken_heart',
  '❣️': 'heart_exclamation',
  '💕': 'two_hearts',
  '💞': 'revolving_hearts',
  '💓': 'heartbeat',
  '💗': 'growing_heart',
  '💖': 'sparkling_heart',
  '💘': 'cupid',
  '💝': 'gift_heart',
  '💟': 'heart_decoration',
  '☮️': 'peace',
  '✝️': 'cross',
  '☪️': 'star_and_crescent',
  '🕉️': 'om_symbol',
  '☸️': 'wheel_of_dharma',
  '✡️': 'star_of_david',
  '🔯': 'six_pointed_star',
  '🕎': 'menorah',
  '☯️': 'yin_yang',
  '☦️': 'orthodox_cross',
  '🛐': 'place_of_worship',
  '⚛️': 'atom',
  '🉑': 'accept',
  '☢️': 'radioactive',
  '☣️': 'biohazard',
  '📴': 'mobile_phone_off',
  '📳': 'vibration_mode',
  '🈶': 'not_free_of_charge',
  '🈚': 'free_of_charge',
  '🈸': 'application',
  '🈺': 'open_for_business',
  '🈷️': 'monthly_amount',
  '✴️': 'eight_pointed_star',
  '🆚': 'vs',
  '💮': 'white_flower',
  '🉐': 'ideograph_advantage',
  '㊙️': 'secret',
  '㊗️': 'congratulations',
  '🈴': 'passing_grade',
  '🈵': 'no_vacancy',
  '🈹': 'discount',
  '🈲': 'prohibited',
  '🅰️': 'a_button',
  '🅱️': 'b_button',
  '🆎': 'ab_button',
  '🆑': 'cl_button',
  '🅾️': 'o_button',
  '🆘': 'sos_button',
  '❌': 'cross_mark',
  '⭕': 'heavy_large_circle',
  '🛑': 'stop_sign',
  '⛔': 'no_entry',
  '📛': 'name_badge',
  '🚫': 'prohibited',
  '💯': 'hundred',
  '💢': 'anger',
  '♨️': 'hot_springs',
  '🚷': 'no_pedestrians',
  '🚯': 'no_littering',
  '🚳': 'no_bicycles',
  '🚱': 'non_potable_water',
  '🔞': 'underage',
  '📵': 'no_mobile_phones',
  '🚭': 'no_smoking',
  '❗': 'exclamation',
  '❕': 'grey_exclamation',
  '❓': 'question',
  '❔': 'grey_question',
  '‼️': 'double_exclamation',
  '⁉️': 'interrobang',
  '🔅': 'low_brightness',
  '🔆': 'high_brightness',
  '〽️': 'part_alternation_mark',
  '⚠️': 'warning',
  '🚸': 'children_crossing',
  '🔱': 'trident',
  '⚜️': 'fleur_de_lis',
  '🔰': 'beginner',
  '♻️': 'recycle',
  '✅': 'check_mark_button',
  '🈯': 'reserved',
  '💹': 'chart_increasing_with_yen',
  '❇️': 'sparkle',
  '✳️': 'eight_spoked_asterisk',
  '❎': 'cross_mark_button',
  '🌐': 'globe_with_meridians',
  '💠': 'diamond_shape_with_a_dot_inside',
  'Ⓜ️': 'circled_m',
  '🌀': 'cyclone',
  '💤': 'zzz',
  '🏧': 'atm',
  '🚾': 'water_closet',
  '♿': 'wheelchair',
  '🅿️': 'parking',
  '🈳': 'vacancy',
  '🈂️': 'service_charge',
  '🛂': 'passport_control',
  '🛃': 'customs',
  '🛄': 'baggage_claim',
  '🛅': 'left_luggage',
  '🚹': 'mens',
  '🚺': 'womens',
  '🚼': 'baby_symbol',
  '🚻': 'restroom',
  '🚮': 'put_litter_in_its_place',
  '🎦': 'cinema',
  '📶': 'signal_strength',
  '🈁': 'here',
  '🔣': 'symbols',
  'ℹ️': 'information',
  '🔤': 'abc',
  '🔡': 'abcd',
  '🔠': 'capital_abcd',
  '🆖': 'ng_button',
  '🆗': 'ok_button',
  '🆙': 'up_button',
  '🆒': 'cool_button',
  '🆕': 'new_button',
  '🆓': 'free_button',
  '0️⃣': 'keycap_0',
  '1️⃣': 'keycap_1',
  '2️⃣': 'keycap_2',
  '3️⃣': 'keycap_3',
  '4️⃣': 'keycap_4',
  '5️⃣': 'keycap_5',
  '6️⃣': 'keycap_6',
  '7️⃣': 'keycap_7',
  '8️⃣': 'keycap_8',
  '9️⃣': 'keycap_9',
  '🔟': 'keycap_10',
  '🔢': 'input_numbers',
  '#️⃣': 'keycap_hash',
  '*️⃣': 'keycap_asterisk',
  '⏏️': 'eject_button',
  '▶️': 'play_button',
  '⏸️': 'pause_button',
  '⏯️': 'play_or_pause_button',
  '⏹️': 'stop_button',
  '⏺️': 'record_button',
  '⏭️': 'next_track_button',
  '⏮️': 'last_track_button',
  '⏩': 'fast_forward_button',
  '⏪': 'fast_reverse_button',
  '⏫': 'fast_up_button',
  '⏬': 'fast_down_button',
  '◀️': 'reverse_button',
  '🔼': 'upwards_button',
  '🔽': 'downwards_button',
  '➡️': 'right_arrow',
  '⬅️': 'left_arrow',
  '⬆️': 'up_arrow',
  '⬇️': 'down_arrow',
  '↗️': 'upper_right_arrow',
  '↘️': 'lower_right_arrow',
  '↙️': 'lower_left_arrow',
  '↖️': 'upper_left_arrow',
  '↕️': 'up_down_arrow',
  '↔️': 'left_right_arrow',
  '↪️': 'right_arrow_curving_left',
  '↩️': 'left_arrow_curving_right',
  '⤴️': 'right_arrow_curving_up',
  '⤵️': 'right_arrow_curving_down',
  '🔀': 'twisted_rightwards_arrows',
  '🔁': 'repeat_button',
  '🔂': 'repeat_single_button',
  '🔄': 'counterclockwise_arrows_button',
  '🔃': 'clockwise_vertical_arrows',
  '🎵': 'musical_note',
  '🎶': 'musical_notes',
  '➕': 'plus',
  '➖': 'minus',
  '➗': 'divide',
  '✖️': 'multiply',
  '🟰': 'heavy_equals_sign',
  '♾️': 'infinity',
  '💲': 'heavy_dollar_sign',
  '💱': 'currency_exchange',
  '™️': 'trademark',
  '©️': 'copyright',
  '®️': 'registered',
  '〰️': 'wavy_dash',
  '➰': 'curly_loop',
  '➿': 'double_curly_loop',
  '🔚': 'end_arrow',
  '🔙': 'back_arrow',
  '🔛': 'on_arrow',
  '🔝': 'top_arrow',
  '🔜': 'soon_arrow',
  '✔️': 'check_mark',
  '☑️': 'check_box_with_check',
  '🔘': 'radio_button',
  '🔴': 'red_circle',
  '🟠': 'orange_circle',
  '🟡': 'yellow_circle',
  '🟢': 'green_circle',
  '🔵': 'blue_circle',
  '🟣': 'purple_circle',
  '⚫': 'black_circle',
  '⚪': 'white_circle',
  '🟤': 'brown_circle',
  '🔺': 'red_triangle_pointed_up',
  '🔻': 'red_triangle_pointed_down',
  '🔸': 'small_orange_diamond',
  '🔹': 'small_blue_diamond',
  '🔶': 'large_orange_diamond',
  '🔷': 'large_blue_diamond',
  '🔳': 'white_square_button',
  '🔲': 'black_square_button',
  '▪️': 'black_small_square',
  '▫️': 'white_small_square',
  '◾': 'black_medium_small_square',
  '◽': 'white_medium_small_square',
  '◼️': 'black_medium_square',
  '◻️': 'white_medium_square',
  '⬛': 'black_large_square',
  '⬜': 'white_large_square',
  '🟫': 'brown_square',
  '🟪': 'purple_square',
  '🟦': 'blue_square',
  '🟩': 'green_square',
  '🟨': 'yellow_square',
  '🟧': 'orange_square',
  '🟥': 'red_square',
  '🔈': 'speaker_low_volume',
  '🔇': 'muted_speaker',
  '🔉': 'speaker_medium_volume',
  '🔊': 'speaker_high_volume',
  '🔔': 'bell',
  '🔕': 'bell_with_slash',
  '📣': 'megaphone',
  '📢': 'loudspeaker',
  '👁️‍🗨️': 'eye_in_speech_bubble',
  '💬': 'speech_balloon',
  '💭': 'thought_balloon',
  '🗯️': 'right_anger_bubble',
  '♠️': 'spade_suit',
  '♣️': 'club_suit',
  '♥️': 'heart_suit',
  '♦️': 'diamond_suit',
  '🃏': 'joker',
  '🎴': 'flower_playing_cards',
  '🀄': 'mahjong_red_dragon',
  '🕐': 'one_oclock',
  '🕑': 'two_oclock',
  '🕒': 'three_oclock',
  '🕓': 'four_oclock',
  '🕔': 'five_oclock',
  '🕕': 'six_oclock',
  '🕖': 'seven_oclock',
  '🕗': 'eight_oclock',
  '🕘': 'nine_oclock',
  '🕙': 'ten_oclock',
  '🕚': 'eleven_oclock',
  '🕛': 'twelve_oclock',
  '🕜': 'one_thirty',
  '🕝': 'two_thirty',
  '🕞': 'three_thirty',
  '🕟': 'four_thirty',
  '🕠': 'five_thirty',
  '🕡': 'six_thirty',
  '🕢': 'seven_thirty',
  '🕣': 'eight_thirty',
  '🕤': 'nine_thirty',
  '🕥': 'ten_thirty',
  '🕦': 'eleven_thirty',
  '🕧': 'twelve_thirty'
};

const EmojiPicker = ({ onEmojiSelect, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Get frequently used emojis (first 50)
  const frequentEmojis = Object.keys(EMOJI_DATA).slice(0, 50);
  
  // Filter emojis based on search
  const getFilteredEmojis = () => {
    if (!searchTerm.trim()) {
      return frequentEmojis;
    }
    
    return Object.entries(EMOJI_DATA)
      .filter(([emoji, name]) => 
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emoji.includes(searchTerm)
      )
      .map(([emoji]) => emoji)
      .slice(0, 30); // Limit results
  };

  const handleEmojiClick = (emoji) => {
    console.log('🎭 [EmojiPicker] Emoji clicked:', emoji);
    onEmojiSelect(emoji);
    console.log('🎭 [EmojiPicker] onEmojiSelect called');
  };

  const filteredEmojis = getFilteredEmojis();

  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-3 ${className}`}>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-slate-700 text-white text-sm border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Emojis Grid */}
      <div className="max-h-48 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-700 rounded transition-colors"
              title={EMOJI_DATA[emoji]}
            >
              {emoji}
            </button>
          ))}
        </div>
        
        {filteredEmojis.length === 0 && (
          <div className="text-center py-4 text-slate-400">
            <p className="text-sm">No emojis found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;
