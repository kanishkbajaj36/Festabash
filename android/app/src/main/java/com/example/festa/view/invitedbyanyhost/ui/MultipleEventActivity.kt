package com.example.festa.view.invitedbyanyhost.ui

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.databinding.ActivityMultipleEventBinding
import com.example.festa.view.invitedbyanyhost.adapters.MultipleEventAdapter

class MultipleEventActivity : AppCompatActivity() {
    lateinit var binding: ActivityMultipleEventBinding
    private var eventId = ""
    private var eventTitle = ""
    private var phoneNumber = ""
    private var feedbackType = ""
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_multiple_event)

        val linearLayoutManager =
            LinearLayoutManager(this@MultipleEventActivity, LinearLayoutManager.VERTICAL, false)
        binding.multipleEventRecyclerview.layoutManager = linearLayoutManager
        val adapter = MultipleEventAdapter(this@MultipleEventActivity)
        binding.multipleEventRecyclerview.adapter = adapter

        eventId = intent.getStringExtra("eventId").toString()
        eventTitle = intent.getStringExtra("eventTitle").toString()
        phoneNumber = Festa.encryptedPrefs.userPhone

        Log.e("eventTitleMultiple", "eventTitle " + eventTitle + " eventId " + eventId + " phoneNumber " + phoneNumber)
    }
}