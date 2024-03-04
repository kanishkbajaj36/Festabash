package com.example.festa.fragments.bookmarktabFgmt.AllBookmarkListAdapter

import android.annotation.SuppressLint
import android.content.Context
import android.content.SharedPreferences
import android.graphics.PorterDuff
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.R
import com.example.festa.fragments.bookmarktabFgmt.bookmarkmodelview.AllBookmarkResponse
import com.example.festa.models.Eventlist_Model
import com.example.festa.view.notifications.NotificationItemClick
import com.example.festa.view.notifications.adapters.NotificationAdapter
import com.example.festa.view.notifications.notificationmodelview.NotificationResponse
import de.hdodenhof.circleimageview.CircleImageView
import java.text.SimpleDateFormat
import java.util.*

class BookMarkTabAdapter (
    private val required: Context,
    private var notificationList: List<AllBookmarkResponse.AllCollection>,
    private var notificationItemClick: NotificationItemClick,

    ) :
    RecyclerView.Adapter<BookMarkTabAdapter.ViewHolder>() {


    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val allBookmarkName: TextView = itemView.findViewById(R.id.allBookmarkName)

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.chat_list_layout, parent, false)
        return ViewHolder(itemView)
    }

    @SuppressLint("NotifyDataSetChanged")
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val bookmark = notificationList[position]



        val bookmarkCount = bookmark.collectionEntriesCount
        holder.allBookmarkName.text = "$bookmark.collectionName($bookmarkCount)"


        holder.itemView.setOnClickListener {
            val collectionId = bookmark.collectionId
            notificationItemClick.notificationItem(collectionId!!)
        }


    }

    override fun getItemCount(): Int {
        return notificationList.size
    }


}