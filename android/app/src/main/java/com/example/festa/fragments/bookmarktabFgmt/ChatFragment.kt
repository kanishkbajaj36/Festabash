package com.example.festa.fragments.bookmarktabFgmt

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.viewModels
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.festa.application.Festa
import com.example.festa.databinding.FragmentContactfrgBinding
import com.example.festa.fragments.bookmarktabFgmt.AllBookmarkListAdapter.BookMarkTabAdapter
import com.example.festa.fragments.bookmarktabFgmt.bookmarkmodelview.AllBookmarkModelView
import com.example.festa.fragments.bookmarktabFgmt.bookmarkmodelview.AllBookmarkResponse
import com.example.festa.models.Eventlist_Model
import com.example.festa.view.notifications.NotificationItemClick
import com.example.festa.view.notifications.adapters.NotificationAdapter
import com.example.festa.view.notifications.notificationmodelview.NotificationModelView
import com.example.festa.view.notifications.notificationmodelview.NotificationResponse
import com.example.festa.view.notifications.viewnotificationmodelview.ViewNotificationModelView
import com.freqwency.promotr.utils.ErrorUtil
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ChatFragment : Fragment(), NotificationItemClick {
    private var _binding: FragmentContactfrgBinding? = null
    private val binding get() = _binding!!
    private lateinit var activity: Activity

    private val bookmarkViewModel: AllBookmarkModelView by viewModels()
    private val progressDialog by lazy { CustomProgressDialog(activity) }
    private var bookmarkListAdapter: BookMarkTabAdapter? = null
    private var notificationList: List<AllBookmarkResponse.AllCollection> = ArrayList()
    private var userId = ""
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment

        _binding = FragmentContactfrgBinding.inflate(inflater, container, false)
        val view = binding.root

        activity = requireActivity()

        userId = Festa.encryptedPrefs.UserId

        return view

        allBookmarkObserverList()
        allBookmarkObserver()
    }

    private fun allBookmarkObserverList() {
        bookmarkViewModel.getAllBookmark(progressDialog, activity, userId)
    }


    @SuppressLint("FragmentLiveDataObserve")
    private fun allBookmarkObserver() {
        bookmarkViewModel.progressIndicator.observe(this) {
        }
        bookmarkViewModel.mInviteResponse.observe(this) {
            val message = it.peekContent().message
            val success = it.peekContent().success


            if (success == true) {
                notificationList = it.peekContent().allCollections!!
                binding.chatListRecycler.visibility = View.VISIBLE
                Log.e("eventTypeData", "dataList: ${notificationList.size}")
                binding.chatListRecycler.layoutManager = LinearLayoutManager(requireContext())
                bookmarkListAdapter = BookMarkTabAdapter(activity, notificationList, this)
                binding.chatListRecycler.adapter = bookmarkListAdapter
            } else {
                binding.notAnyEventAdded.visibility = View.VISIBLE
            }


        }

        bookmarkViewModel.errorResponse.observe(requireActivity()) {
            ErrorUtil.handlerGeneralError(requireContext(), it)
            // errorDialogs()
        }
    }

    override fun notificationItem(notificationId: String) {

    }

}