package com.example.festa.view.invitedbyanyhost.ui

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.RadioButton
import android.widget.Toast
import androidx.activity.viewModels
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.databinding.ActivitySingleEventBinding
import com.example.festa.view.guest.viewmodel.guests.GuestBody
import com.example.festa.view.guest.viewmodel.guests.GuestViewModel
import com.example.festa.view.invitedbyanyhost.guestresonsemodel.GuestInviteModelView
import com.example.festa.view.invitedbyanyhost.guestresonsemodel.GuestInviteResponseBody
import com.example.festa.view.invitedbyanyhost.viewmodel.InvitedByPersonModelView
import com.example.festa.view.notifications.adapters.NotificationAdapter
import com.example.festa.view.notifications.notificationmodelview.NotificationModelView
import com.freqwency.promotr.utils.ErrorUtil
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint
import java.text.SimpleDateFormat
import java.util.*

@AndroidEntryPoint
class SingleEventActivity : AppCompatActivity() {
    lateinit var binding: ActivitySingleEventBinding
    private var eventId = ""
    private var eventTitle = ""
    private var phoneNumber = ""
    private var feedbackType = ""


    private val invitedViewModel: InvitedByPersonModelView by viewModels()
    private val addGuestModel: GuestInviteModelView by viewModels()
    private val progressDialog by lazy { CustomProgressDialog(this@SingleEventActivity) }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_single_event)

        eventId = intent.getStringExtra("eventId").toString()
        eventTitle = intent.getStringExtra("eventTitle").toString()
        phoneNumber = Festa.encryptedPrefs.userPhone

        Log.e(
            "eventTitle",
            "eventTitle " + eventTitle + " eventId " + eventId + " phoneNumber " + phoneNumber
        )
        binding.backArrow.setOnClickListener {
            finish()
        }

        binding.rdoTranspotation.setOnCheckedChangeListener { group, checkedId ->
            val radioButton = findViewById<RadioButton>(checkedId)
            feedbackType = radioButton.text.toString()

            Log.e("feedbackType", "feedbackType.." + feedbackType)
        }
        binding.sendBtn.setOnClickListener {
            sendResponseApi()
        }
        // Get Data and observer
        getNotificationList()
        invitedByObserver()
        sendResponseObserver()
    }


    private fun getNotificationList() {
        invitedViewModel.getInvitedBy(progressDialog, this@SingleEventActivity, eventId)
    }

    @SuppressLint("FragmentLiveDataObserve")
    private fun invitedByObserver() {
        invitedViewModel.progressIndicator.observe(this) {
        }
        invitedViewModel.mInviteResponse.observe(this) {
            val message = it.peekContent().message
            val success = it.peekContent().success
            val eventData = it.peekContent().eventData

            binding.descriptionTxt.text = eventData?.description
            binding.hostNameTxt.text = eventData?.userName
            binding.eventTypeTxt.text = eventData?.eventType
            binding.eventNameTxt.text = eventData?.title
            binding.hotelNameTxt.text = eventData?.venueName
            binding.hotelAddressTxt.text = eventData?.venueLocation

            val startTime = eventData?.startTime
            val endTime = eventData?.endTime

            val convertedTime = convertToAMPM(startTime.toString())
            val convertedEnd = convertToAMPM(endTime.toString())
            binding.timeTxt.text = "$convertedTime - $convertedEnd"

            val inputDate = eventData?.date
            binding.hostPhoneTxt.text = "Phone No. : ${eventData?.userPhone}"

            Log.e("dateTxtASDD", "dateTxt " + eventData?.startTime)

            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
            inputFormat.timeZone = TimeZone.getTimeZone("UTC")
            try {
                val date = inputFormat.parse(inputDate)

                // Format date to "Sunday 20th December 2023"
                val outputFormat = SimpleDateFormat(
                    "EEEE d'${getDayOfMonthSuffix(date.day)}' MMMM yyyy",
                    Locale.US
                )
                val formattedDate = outputFormat.format(date)


                // Set formatted date and time to TextViews
                binding.dateTxt.text = formattedDate
                //binding.timeTxt.text = formattedTime
            } catch (e: Exception) {
                e.printStackTrace()
            }


        }

        invitedViewModel.errorResponse.observe(this@SingleEventActivity)
        {
            ErrorUtil.handlerGeneralError(this, it)
            // errorDialogs()
        }

    }

    private fun sendResponseApi() {
        val acceptBody = GuestInviteResponseBody(
            response = feedbackType,
            event_title = eventTitle,
            phone_no = phoneNumber
        )
        Log.e(
            "eventTitle",
            "eventTitle Api " + eventTitle + " eventId " + eventId + " phoneNumber " + phoneNumber)

        addGuestModel.addNewGuest(progressDialog, this@SingleEventActivity,eventId,acceptBody)
    }

    private fun sendResponseObserver() {
        addGuestModel.progressIndicator.observe(this@SingleEventActivity) {
        }
        addGuestModel.mAddGuest.observe(this@SingleEventActivity) {
            val message = it.peekContent().responseMessage
            Toast.makeText(this@SingleEventActivity, message, Toast.LENGTH_SHORT).show()

        }
        addGuestModel.errorResponse.observe(this@SingleEventActivity) {
            com.freqwency.promotr.utils.ErrorUtil.handlerGeneralError(this@SingleEventActivity, it)
            // errorDialogs()
        }
    }


    private fun getDayOfMonthSuffix(n: Int): String {
        if (n in 11..13) {
            return "th"
        }
        when (n % 10) {
            1 -> return "st"
            2 -> return "nd"
            3 -> return "rd"
            else -> return "th"
        }
    }

    fun convertToAMPM(timeString: String): String {
        val inputFormat = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
        val outputFormat = SimpleDateFormat("h:mm a", Locale.getDefault())
        val date = inputFormat.parse(timeString)
        return outputFormat.format(date)
    }
}