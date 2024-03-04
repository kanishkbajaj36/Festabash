package com.example.festa.view.feedback.ui

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.RadioButton
import android.widget.Toast
import androidx.activity.viewModels
import androidx.databinding.DataBindingUtil.*
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.databinding.ActivityFeedBackBinding
import com.example.festa.view.feedback.viewmodel.FeedbackBody
import com.example.festa.view.feedback.viewmodel.FeedbackModelView
import com.freqwency.promotr.utils.ErrorUtil
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class FeedBackActivity : AppCompatActivity() {
    lateinit var binding: ActivityFeedBackBinding
    private val feedbackViewModel: FeedbackModelView by viewModels()
    private lateinit var feedbackBody: FeedbackBody
    private val progressDialog by lazy { CustomProgressDialog(this@FeedBackActivity) }
    private var userId = ""
    private var ratingValue = ""
    private var messageTxt = ""
    private var feedbackType = ""
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = setContentView(this, R.layout.activity_feed_back)

        binding.backarrowLayout.setOnClickListener { finish() }
        userId = Festa.encryptedPrefs.UserId


        binding.ratingBarId.setOnRatingBarChangeListener { _, rating, _ ->

            ratingValue = rating.toString()
        }

        binding.feedbackSaveBtn.setOnClickListener {
            messageTxt = binding.comment.text.toString()
            feedbackApi()
        }

        binding.radioGroup.setOnCheckedChangeListener { group, checkedId ->
            val radioButton = findViewById<RadioButton>(checkedId)
            feedbackType = radioButton.text.toString()

            Log.e("feedbackType", "feedbackType.." + feedbackType)
        }


        feedbackObserver()
    }


    private fun feedbackApi() {
        feedbackBody = FeedbackBody(
            rating = ratingValue,
            message = messageTxt,
            feedback_Type = feedbackType
        )
        feedbackViewModel.addFeedback(
            progressDialog,
            this@FeedBackActivity, userId, feedbackBody
        )
    }

    private fun feedbackObserver() {
        feedbackViewModel.progressIndicator.observe(this@FeedBackActivity) {
        }
        feedbackViewModel.commentOnFeedResponse.observe(
            this@FeedBackActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message
            Toast.makeText(this@FeedBackActivity, message, Toast.LENGTH_LONG).show()

        }

        feedbackViewModel.errorResponse.observe(this@FeedBackActivity) {
            ErrorUtil.handlerGeneralError(this@FeedBackActivity, it)
        }
    }
}