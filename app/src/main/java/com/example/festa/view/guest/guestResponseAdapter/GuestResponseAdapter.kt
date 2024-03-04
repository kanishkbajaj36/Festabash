package com.example.festa.view.guest.guestResponseAdapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.R
import com.example.festa.view.guest.guestlistresponse.GuestListUserResponse
import com.example.festa.view.notifications.adapters.NotificationAdapter
import com.example.festa.view.notifications.notificationmodelview.NotificationResponse
import de.hdodenhof.circleimageview.CircleImageView

class GuestResponseAdapter (
    private val required: Context,
    private var guestResponseList: List<GuestListUserResponse.Guests>,

    ) :
    RecyclerView.Adapter<GuestResponseAdapter.ViewHolder>() {

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val guestName: TextView = itemView.findViewById(R.id.guestName)
        val guestMobNo: TextView = itemView.findViewById(R.id.guestMobNo)
        val userResponseTxt: TextView = itemView.findViewById(R.id.userResponseTxt)
        val responseBackground: LinearLayout = itemView.findViewById(R.id.responseBackground)

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.guest_list_response_layout, parent, false)
        return ViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val guestResponse = guestResponseList[position]
        holder.guestName.text = guestResponse.guestName
        holder.guestMobNo.text = guestResponse.phoneNo.toString()

        val userResponse = guestResponse.status

        if (userResponse == 0)
        {
            holder.userResponseTxt.text = "Accepted"
            holder.responseBackground.setBackgroundResource(R.drawable.accept_background)
        }
        else if (userResponse == 1)
        {
            holder.userResponseTxt.text = "Rejected"
            holder.responseBackground.setBackgroundResource(R.drawable.guest_list_response)
        }
        else if (userResponse == 2)
        {
            holder.userResponseTxt.text = "Pending"
            holder.responseBackground.setBackgroundResource(R.drawable.pending_response_background)
        }
        else if (userResponse == 3)
        {
            holder.userResponseTxt.text = "May be"
            holder.responseBackground.setBackgroundResource(R.drawable.may_be_background)
        }



        // Glide.with(required).load("http://13.51.205.211:6002/$url").placeholder(R.drawable.baseline_person_24).into(holder.notificationImg)

    }

    override fun getItemCount(): Int {
        return guestResponseList.size
    }


}