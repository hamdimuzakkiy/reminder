var sheetName = "reminder"
var myEmail = Session.getActiveUser().getEmail()
var remindMeAt = 8
var remindMeAtSecond = 8 * 60 * 60
var prefixEventName = "[automated reminder]"
var currentDate = new Date();
currentDate.setSeconds(0)
currentDate.setMinutes(0)
currentDate.setHours(0)
var tomorrow = new Date(currentDate);
tomorrow.setHours(24)

function main() {
  var sheetData = fetchReminderData()
  var currentEvent = getCalendarEvent(function (){
    var dates = []
    var datesExist = {}
    sheetData.forEach(function(unFinished){
      if (datesExist[unFinished.date] === undefined) {
        dates.push(new Date(unFinished.date))
        datesExist[unFinished.date] = true
      }
    })
    return dates
  }())
  var decision = matchingExistingCalendar(sheetData, currentEvent)
  deleteEvent(decision.deleting)
  generateEvent(decision.creating)
}

function matchingExistingCalendar(sheetData, currentEvent) {
  var deleting = []

  var sheetDataMap = {}
  var currentEventMap = {}

  sheetData.forEach(function(item) {    
    var month = parseInt(item.date.getMonth()) + 1
    var date = item.date.getFullYear() + "-" + month + "-" + item.date.getDate()
    var key = item.name+"-"+date
    sheetDataMap[prefixEventName + " " + key] = item
  })

  currentEvent.forEach(function(item) {
    var month = parseInt(item.date.getMonth()) + 1
    var date = item.date.getFullYear() + "-" + month + "-" + item.date.getDate()
    key = item.name+"-"+date
    currentEventMap[key] = item
  })
  
  currentEvent.forEach(function(item) {
    var month = parseInt(item.date.getMonth())+1
    var onlyDate = item.date.getFullYear() + "-" + month + "-" + item.date.getDate()
    var nextDay = new Date()
    nextDay.setSeconds(60*60*24)
    var nextMonth = parseInt(nextDay.getMonth())+1
    var nextOnlyDate = nextDay.getFullYear() + "-" + nextMonth + "-" + nextDay.getDate()
  
    key = item.name+"-"+onlyDate
    key2 = item.name+"-"+nextOnlyDate

    if (sheetDataMap[key] === undefined && sheetDataMap[key2] === undefined) {
      deleting.push(item.id)
      console.log("deleting : ", item)
      delete sheetDataMap[key]
      delete sheetDataMap[key2]
    }
  })

  return {
    deleting: deleting,
    creating: function() {
      var result = []
      for (v in sheetDataMap) {
        if (currentEventMap[v] === undefined) {
          result.push(sheetDataMap[v])
        }
      }
      return result
    }(),
  }
}

function compareDateGreaterEqual(a,b) {
  return a>=b
}

function deleteEvent(ids) {
  ids.forEach(function(id){
    var event = CalendarApp.getDefaultCalendar().getEventById(id)
    event.deleteEvent()
    console.log("delete event: ", event.getTitle(), event.getStartTime())
  })
}

function generateEvent(reminderData) {
  reminderData.forEach(function(event) {
    monthEta = event.eta.getMonth() + 1
    var eta = event.eta.getFullYear() + "/" + monthEta + "/" + event.eta.getDate()
    var date = event.date
    date.setHours(remindMeAt)

    var event = CalendarApp.getDefaultCalendar().createEvent(title= prefixEventName +" "+ event.name, startTime= event.date, endTime= event.date, {
      description: event.desc + "\nETA: "+eta,
      guests: event.guests,
    })
    console.log("Event Created: "+ event.getTitle() + " " +CalendarApp.getDefaultCalendar().getEventById(event.getId()).getStartTime())
  })
}

function getCalendarEvent(dates) {
  var myReminder = []
  dates.forEach(function(date){
    var untilDate = new Date(date)
    untilDate.setSeconds((24*60*60)-1)
    var events = CalendarApp.getDefaultCalendar().getEventsForDay(date)
    events.forEach(function(e) {
      if (e.getTitle().includes(prefixEventName) && e.getCreators() == myEmail) {
        myReminder.push({
          id: e.getId(),
          name: e.getTitle(),
          desc: e.getDescription(),
          guests: e.getGuestList(),
          date: e.getStartTime(),
        })
      }
    })
  })
  return myReminder
}

function fetchReminderData() {
  var reminderRaws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues();
  var unFinished = [];
  reminderRaws.forEach(function(item){
    if (item[0].trim() != "" && item[4] == false) {
      var nowDate = new Date(item[2])
      if (compareDateGreaterEqual(currentDate, item[2])) {
        nowDate = tomorrow
      }
      unFinished.push({
        name: item[0].trim(),
        desc: item[1],
        date: nowDate,
        eta: item[2],
        guests: item[3],
        notes: item[5]
      })
    }
  })
  return unFinished
}
