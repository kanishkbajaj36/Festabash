package com.example.festa.view.notifications.ui

import android.annotation.SuppressLint
import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.activity.viewModels
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.databinding.ActivityNotificationListBinding
import com.example.festa.view.notifications.NotificationItemClick
import com.example.festa.view.notifications.adapters.NotificationAdapter
import com.example.festa.view.notifications.notificationmodelview.NotificationModelView
import com.example.festa.view.notifications.notificationmodelview.NotificationResponse
import com.example.festa.view.notifications.viewnotificationmodelview.ViewNotificationModelView
import com.freqwency.promotr.utils.ErrorUtil
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class NotificationListActivity : AppCompatActivity(), NotificationItemClick {
    lateinit var binding: ActivityNotificationListBinding
    private lateinit var activity: Activity

    private val notificationViewModel: NotificationModelView by viewModels()
    private val viewNotificationViewModel: ViewNotificationModelView by viewModels()
    private val progressDialog by lazy { CustomProgressDialog(activity) }
    private var userId = ""

    private var notifiactionListAdapter: NotificationAdapter? = null
    private var notificationList: List<NotificationResponse.Notification> = ArrayList()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)


        binding = DataBindingUtil.setContentView(this, R.layout.activity_notification_list)

        activity = this
        userId = Festa.encryptedPrefs.UserId

        Log.e("userIdNoti", "userId.." + userId)

        binding.backarrowLayout.setOnClickListener { finish() }


        // api and observer
        getNotificationList()
        notificationListObserver()
        notificationViewListObserver()
    }

    override fun notificationItem(notificationId: String) {
        getViewNotificationList(notificationId)

    }


    private fun getViewNotificationList(notificationId: String) {
        viewNotificationViewModel.getNotifications(progressDialog, activity, notificationId)
    }


    @SuppressLint("FragmentLiveDataObserve")
    private fun notificationViewListObserver() {
        viewNotificationViewModel.progressIndicator.observe(this) {
        }
        viewNotificationViewModel.mNotificationResponse.observe(this) {
            val message = it.peekContent().message
            val success = it.peekContent().success

            getNotificationList()

        }

        notificationViewModel.errorResponse.observe(this@NotificationListActivity) {
            ErrorUtil.handlerGeneralError(this, it)
            // errorDialogs()
        }
    }

    private fun getNotificationList() {
        notificationViewModel.getNotifications(progressDialog, activity, userId)
    }


    @SuppressLint("FragmentLiveDataObserve")
    private fun notificationListObserver() {
        notificationViewModel.progressIndicator.observe(this) {
        }
        notificationViewModel.mNotificationResponse.observe(this) {
            val message = it.peekContent().message
            val success = it.peekContent().success


            if (success == true) {
                notificationList = it.peekContent().notifications!!
                binding.notificationrecycle.visibility = View.VISIBLE
                val count = it.peekContent().notificationCount
                binding.notificationCount.text = "Notification($count)"

                Log.e("eventTypeData", "dataList: ${notificationList.size}")
                binding.notificationrecycle.layoutManager = LinearLayoutManager(this)
                notifiactionListAdapter = NotificationAdapter(activity, notificationList, this)
                binding.notificationrecycle.adapter = notifiactionListAdapter
            } else {
                binding.notAnyEventAdded.visibility = View.VISIBLE
            }


        }

        notificationViewModel.errorResponse.observe(this@NotificationListActivity) {
            ErrorUtil.handlerGeneralError(this, it)
            // errorDialogs()
        }
    }


}