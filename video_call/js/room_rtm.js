
let handleChannelMessage = async (messageData, MemberId) => {
  console.log("------------------------------------------------------------------------------------------------A new message was received");
  let data = JSON.parse(messageData.text)
  console.log('message:',data)
  if (data.type === 'chat') {
    trans(data.displayName,data.message)
    // addMessageToDom(data.displayName, data.message)
  }

  if (data.type === 'user_left') {
    document.getElementById(`user-container-${data.uid}`).remove()

    if (userIdInDisplayFrame === `user-container-${uid}`) {
      displayFrame.style.display = null

      for (let i = 0; videoFrames.length > i; i++) {
        videoFrames[i].style.height = '500px'
        videoFrames[i].style.width = '500px'
      }
    }
  }
}

let sendMessage = async (e) => {
  console.log(e);
  e.preventDefault()
  let message=e.target.message.value
  channel.sendMessage({
    text: JSON.stringify({
      'type': 'chat',
      'message': message,
      'displayName': displayName
    })
  })
  // trans(message);
  addMessageToDom(displayName, message)
  e.target.reset()
}

let addMessageToDom = (name, text) => {
  // console.log("1",message)
  let messagesWrapper = document.getElementById('messages')
  // trans(message);
  // console.log("4",message)
  let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${text}</p>
                        </div>
                    </div>`

  messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

  let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
  if (lastMessage) {
    lastMessage.scrollIntoView()
  }
}


let addBotMessageToDom = (botMessage) => {
  let messagesWrapper = document.getElementById('messages')

  let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🤖 Cupit Bot</strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`

  messagesWrapper.insertAdjacentHTML('beforeend', newMessage)

  let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
  if (lastMessage) {
    lastMessage.scrollIntoView()
  }
}

let leaveChannel = async () => {
  await channel.leave()
  await rtmClient.logout()
}







// const countries = {
//   "am-ET": "Amharic",
//   "ar-SA": "Arabic",
//   "be-BY": "Bielarus",
//   "bem-ZM": "Bemba",
//   "bi-VU": "Bislama",
//   "bjs-BB": "Bajan",
//   "bn-IN": "Bengali",
//   "bo-CN": "Tibetan",
//   "br-FR": "Breton",
//   "bs-BA": "Bosnian",
//   "ca-ES": "Catalan",
//   "cop-EG": "Coptic",
//   "cs-CZ": "Czech",
//   "cy-GB": "Welsh",
//   "da-DK": "Danish",
//   "dz-BT": "Dzongkha",
//   "de-DE": "German",
//   "dv-MV": "Maldivian",
//   "el-GR": "Greek",
//   "en-GB": "English",
//   "es-ES": "Spanish",
//   "et-EE": "Estonian",
//   "eu-ES": "Basque",
//   "fa-IR": "Persian",
//   "fi-FI": "Finnish",
//   "fn-FNG": "Fanagalo",
//   "fo-FO": "Faroese",
//   "fr-FR": "French",
//   "gl-ES": "Galician",
//   "gu-IN": "Gujarati",
//   "ha-NE": "Hausa",
//   "he-IL": "Hebrew",
//   "hi-IN": "Hindi",
//   "hr-HR": "Croatian",
//   "hu-HU": "Hungarian",
//   "id-ID": "Indonesian",
//   "is-IS": "Icelandic",
//   "it-IT": "Italian",
//   "ja-JP": "Japanese",
//   "kk-KZ": "Kazakh",
//   "km-KM": "Khmer",
//   "kn-IN": "Kannada",
//   "ko-KR": "Korean",
//   "ku-TR": "Kurdish",
//   "ky-KG": "Kyrgyz",
//   "la-VA": "Latin",
//   "lo-LA": "Lao",
//   "lv-LV": "Latvian",
//   "men-SL": "Mende",
//   "mg-MG": "Malagasy",
//   "mi-NZ": "Maori",
//   "ms-MY": "Malay",
//   "mt-MT": "Maltese",
//   "my-MM": "Burmese",
//   "ne-NP": "Nepali",
//   "niu-NU": "Niuean",
//   "nl-NL": "Dutch",
//   "no-NO": "Norwegian",
//   "ny-MW": "Nyanja",
//   "ur-PK": "Pakistani",
//   "pau-PW": "Palauan",
//   "pa-IN": "Panjabi",
//   "ps-PK": "Pashto",
//   "pis-SB": "Pijin",
//   "pl-PL": "Polish",
//   "pt-PT": "Portuguese",
//   "rn-BI": "Kirundi",
//   "ro-RO": "Romanian",
//   "ru-RU": "Russian",
//   "sg-CF": "Sango",
//   "si-LK": "Sinhala",
//   "sk-SK": "Slovak",
//   "sm-WS": "Samoan",
//   "sn-ZW": "Shona",
//   "so-SO": "Somali",
//   "sq-AL": "Albanian",
//   "sr-RS": "Serbian",
//   "sv-SE": "Swedish",
//   "sw-SZ": "Swahili",
//   "ta-LK": "Tamil",
//   "te-IN": "Telugu",
//   "tet-TL": "Tetum",
//   "tg-TJ": "Tajik",
//   "th-TH": "Thai",
//   "ti-TI": "Tigrinya",
//   "tk-TM": "Turkmen",
//   "tl-PH": "Tagalog",
//   "tn-BW": "Tswana",
//   "to-TO": "Tongan",
//   "tr-TR": "Turkish",
//   "uk-UA": "Ukrainian",
//   "uz-UZ": "Uzbek",
//   "vi-VN": "Vietnamese",
//   "wo-SN": "Wolof",
//   "xh-ZA": "Xhosa",
//   "yi-YD": "Yiddish",
//   "zu-ZA": "Zulu"
// }
//
//
// console.log("translate running")
//
// var selectTag = document.querySelectorAll("select")
// selectTag.forEach((tag, id) => {
//   for (let country_code in countries) {
//     let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : "";
//     let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
//     tag.insertAdjacentHTML("beforeend", option);
//   }
// });

// function trans(){
//   var text;
//   console.log(message)
//   let translateFrom = selectTag[0].value;
//   let translateTo = selectTag[1].value;
//   console.log(translateFrom)
//   console.log(translateTo)
//   let apiUrl = `https://api.mymemory.translated.net/get?q=${message}&langpair=${translateFrom}|${translateTo}`;
//   fetch(apiUrl).then(res => res.json()).then(data => {
//     text=data.responseData.translatedText;
//   });
//   console.log(text);
//   return text;
// }
window.addEventListener('beforeunload', leaveChannel)
let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit', sendMessage)
