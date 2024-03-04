package com.example.festa.view.notifications.adapters

import android.annotation.SuppressLint
import android.app.Dialog
import android.content.Context
import android.content.SharedPreferences
import android.graphics.Color
import android.graphics.PorterDuff
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.models.Eventlist_Model
import com.example.festa.R
import com.example.festa.interfaces.OnItemClickListenerDelete
import com.example.festa.view.guest.adapters.GuestAdapter
import com.example.festa.view.guest.viewmodel.guestlist.GuestListResponse
import com.example.festa.view.notifications.NotificationItemClick
import com.example.festa.view.notifications.notificationmodelview.NotificationResponse
import de.hdodenhof.circleimageview.CircleImageView
import java.text.SimpleDateFormat
import java.util.*

class NotificationAdapter(
    private val required: Context,
    private var notificationList: List<NotificationResponse.Notification>,
    private var notificationItemClick: NotificationItemClick,

    ) :
    RecyclerView.Adapter<NotificationAdapter.ViewHolder>() {

    private lateinit var sharedPreferences: SharedPreferences
    private var selectedItemPosition: Int = -1

    init {
        sharedPreferences = required.getSharedPreferences("notification_pref", Context.MODE_PRIVATE)
        selectedItemPosition = sharedPreferences.getInt("selected_item_position", -1)
    }


    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val titleTxt: TextView = itemView.findViewById(R.id.titleTxt)
        val addressName: TextView = itemView.findViewById(R.id.addressName)
        val notificationDec: TextView = itemView.findViewById(R.id.notificationDec)
        val notificationTime: TextView = itemView.findViewById(R.id.notificationTime)
        val notificationImg: CircleImageView = itemView.findViewById(R.id.notificationImg)
        val parentLayout: LinearLayout = itemView.findViewById(R.id.parentLayout)
        val disableClick: ImageView = itemView.findViewById(R.id.disableClick)
        val viewLine: View = itemView.findViewById(R.id.viewLine)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.notificationlayout, parent, false)
        return ViewHolder(itemView)
    }

    @SuppressLint("NotifyDataSetChanged")
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val notification = notificationList[position]


        holder.titleTxt.text = notification.title
        holder.addressName.text = notification.eventLocation
        holder.notificationDec.text = notification.message
        holder.notificationTime.text = notification.title

        val url = notification.eventImage

        val notificationStatus = notification.status

        holder.itemView.setOnClickListener {
            val notification = notification.notificationId
            if (notification != null) {
                notificationItemClick.notificationItem(notification)
            }
        }

        if (notificationStatus == 0) {
            holder.parentLayout.setBackgroundColor(
                ContextCompat.getColor(
                    required,
                    R.color.white
                )
            )

            holder.disableClick.setImageResource(R.drawable.baseline_circle_24)
            holder.disableClick.setColorFilter(
                ContextCompat.getColor(required, R.color.dark_white),
                PorterDuff.Mode.SRC_IN
            )

            holder.viewLine.visibility = View.GONE

        } else {
            holder.parentLayout.setBackgroundColor(
                ContextCompat.getColor(
                    required,
                    R.color.old_lace
                )
            )
            holder.disableClick.setImageResource(R.drawable.baseline_circle_24)
            holder.disableClick.setColorFilter(
                ContextCompat.getColor(required, R.color.bzantium),
                PorterDuff.Mode.SRC_IN
            )
            holder.viewLine.visibility = View.VISIBLE
        }


        val currentTime = Date()

        val dateString = notification.date
        val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        val date = dateFormat.parse(dateString)

        val diff = currentTime.time - date.time
        val seconds = diff / 1000
        val minutes = seconds / 60
        val hours = minutes / 60
        val days = hours / 24

        val result = when {
            minutes < 60 -> "$minutes minutes ago"
            hours < 24 -> {
                val hourString = if (hours == 1L) "hour" else "hours"
                "$hours $hourString ago"
            }
            else -> {
                val dayString = if (days == 1L) "day" else "days"
                "${(hours / 24)} $dayString ago"
            }
        }

        holder.notificationTime.text = result

        Glide.with(required).load("http://13.51.205.211:6002/$url")
            .placeholder(R.drawable.baseline_person_24).into(holder.notificationImg)


    }

    override fun getItemCount(): Int {
        return notificationList.size
    }


}