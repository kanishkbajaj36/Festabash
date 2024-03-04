package com.example.festa.view.events.adapters

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.fragment.app.FragmentManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.databinding.EventlistLayoutBinding
import com.example.festa.view.createevents.ui.CreateEventFragment
import com.example.festa.view.events.ui.EventListDetailsActivity

import com.example.festa.view.events.viewmodel.particularuserlist.ParticularUserEventListResponse
import com.example.festa.view.guest.ui.GuestActivity
import com.example.festa.view.invitedbyanyhost.ui.MultipleEventActivity
import com.example.festa.view.invitedbyanyhost.ui.SingleEventActivity
import de.hdodenhof.circleimageview.CircleImageView
import java.text.SimpleDateFormat
import java.util.*

class EventListAdapter(
    private val activity: Context,
    private val supportFragmentManager: FragmentManager,
    private var eventList: List<ParticularUserEventListResponse.Event>
) : RecyclerView.Adapter<EventListAdapter.ViewHolder>() {
    var eventId = ""

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding: EventlistLayoutBinding =
            EventlistLayoutBinding.inflate(LayoutInflater.from(activity), parent, false)
        return ViewHolder(binding)
    }

    @SuppressLint("NotifyDataSetChanged")
    fun setFilteredList(eventLists: List<ParticularUserEventListResponse.Event>) {
        this.eventList = eventLists
        notifyDataSetChanged()
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        // val ItemsViewModel = mList[position]
        if (position % 2 == 0) {
            holder.eventlinearbg.setBackgroundResource(R.drawable.borderradious)// Even position
        } else {
            //holder.linearReqBackground.setBackgroundColor(Color.parseColor("#FDF2D6")) // Odd position
            holder.eventlinearbg.setBackgroundResource(R.drawable.borderradiousy) // Odd position
        }

        var eventLocation = ""
        var eventName = ""
        var eventDate = ""
        var eventTime = ""

        val event = eventList[position]
        val venueDateAndTime = event.venueDateAndTime?.getOrNull(0)

        if (venueDateAndTime != null) {
            //The list is not null and not empty
            eventLocation = venueDateAndTime.venueLocation.toString()
            eventDate = venueDateAndTime.date.toString()
            eventTime = venueDateAndTime.startTime.toString()
            holder.dateElist.text = eventDate
            holder.timeElist.text = "-$eventTime"


            if (isDateFormatValid(eventDate)) {
                dateChange(eventDate, holder.dateElist, holder.timeElist)
            }

        } else {

        }

        val imageUrl = "http://13.51.205.211:6002/${event.images!!.firstOrNull()}"
        Glide.with(activity).load(imageUrl)
            .placeholder(R.drawable.partypic) // Placeholder image while loading
            .into(holder.profileimg)

        eventName = event.title.toString()
        holder.eventNameElist.text = eventName
        holder.eventLocElist.text = eventLocation
        val eventTypeData = event.eventTypeName

        val eventKey = event.eventKey
        Log.e("eventIdASD", "eventKey:Ad  $eventId   $eventKey")



        holder.InvitationFirst.setOnClickListener {

            if (eventKey == 1) {
                val eventId = event.id
                val eventTitle = event.title
                val intent = Intent(activity, SingleEventActivity::class.java)
                intent.putExtra("eventId", eventId.toString())
                intent.putExtra("eventTitle", eventTitle.toString())
                activity.startActivity(intent)
            } else {
                val eventId = event.id
                val eventTitle = event.title
                val intent = Intent(activity, MultipleEventActivity::class.java)
                intent.putExtra("eventId", eventId.toString())
                intent.putExtra("eventTitle", eventTitle.toString())
                activity.startActivity(intent)
            }
        }

        holder.InvitationSee.setOnClickListener {

            if (eventKey == 1) {
                val eventId = event.id
                val eventTitle = event.title
                val intent = Intent(activity, SingleEventActivity::class.java)
                intent.putExtra("eventId", eventId.toString())
                intent.putExtra("eventTitle", eventTitle.toString())
                activity.startActivity(intent)
            } else {
                val eventId = event.id
                val eventTitle = event.title
                val intent = Intent(activity, MultipleEventActivity::class.java)
                intent.putExtra("eventId", eventId.toString())
                intent.putExtra("eventTitle", eventTitle.toString())
                activity.startActivity(intent)
            }
        }

        if (eventTypeData == 1) {
            holder.editBtn.visibility = View.VISIBLE
            holder.guestListBtn.visibility = View.VISIBLE
            holder.InvitationFirst.visibility = View.GONE

        } else {
            holder.editBtn.visibility = View.GONE
            holder.guestListBtn.visibility = View.GONE
            holder.InvitationFirst.visibility = View.VISIBLE
        }

        holder.seemoreicon.setOnClickListener {
            holder.seeless.visibility = View.GONE
            holder.seemore.visibility = View.VISIBLE
            if (eventTypeData == 1) {
                holder.clickEditBtn.visibility = View.VISIBLE
                holder.guestlg.visibility = View.VISIBLE
                holder.InvitationSee.visibility = View.GONE


            } else {
                holder.clickEditBtn.visibility = View.GONE
                holder.guestlg.visibility = View.GONE
                holder.InvitationSee.visibility = View.VISIBLE
            }

            holder.eventNameMorelist.text = eventName
            holder.eventLocMorelist.text = eventLocation
            holder.timeMorelist.text = eventTime
            holder.dateMorelist.text = eventDate
            holder.eventDescMorelist.text = event.description

            Glide.with(activity).load(imageUrl)
                .placeholder(R.drawable.partypic) // Placeholder image while loading
                .into(holder.profileimg1)

        }

        holder.seelessicon.setOnClickListener {
            holder.seeless.visibility = View.VISIBLE
            holder.seemore.visibility = View.GONE
        }





        holder.feed.setOnClickListener {
            val eventIds = event.id
            Festa.encryptedPrefs.eventIds = eventIds.toString()
            val intent = Intent(activity, EventListDetailsActivity::class.java)
            intent.putExtra("enterType", "event")
            intent.putExtra("userIds", event.userId.toString())
            activity.startActivity(intent)
        }

        holder.guestlg.setOnClickListener {
            val intent = Intent(activity, GuestActivity::class.java)
            intent.putExtra("eventId", eventId)
            intent.putExtra("GuestResponse", "GuestResponseList")
            activity.startActivity(intent)
        }

        holder.editBtn.setOnClickListener {
            val eventId = event.id!!
            val bundle = Bundle()
            bundle.putString("eventId", eventId)
            bundle.putString("adapter", "adapterValue")

            val guestFragment = CreateEventFragment()
            guestFragment.arguments = bundle
            val transaction = supportFragmentManager.beginTransaction()
            transaction.replace(R.id.containers, guestFragment)
            transaction.addToBackStack(null) // Add to back stack to allow navigating back
            transaction.commit()
        }

        holder.clickEditBtn.setOnClickListener {
            val eventId = event.id!!
            val bundle = Bundle()
            bundle.putString("eventId", eventId)
            bundle.putString("adapter", "adapterValue")
            val guestFragment = CreateEventFragment()
            guestFragment.arguments = bundle
            val transaction = supportFragmentManager.beginTransaction()
            transaction.replace(R.id.containers, guestFragment)
            transaction.addToBackStack(null) // Add to back stack to allow navigating back
            transaction.commit()
        }



        holder.feed1.setOnClickListener {
            val eventIds = event.id
            Festa.encryptedPrefs.eventIds = eventIds.toString()
            val intent = Intent(activity, EventListDetailsActivity::class.java)
            intent.putExtra("enterType", "event")
            intent.putExtra("userIds", event.userId.toString())
            activity.startActivity(intent)
        }

        holder.chatFirst.setOnClickListener {
            val eventIds = event.id
            Festa.encryptedPrefs.eventIds = eventIds.toString()
            val intent = Intent(activity, EventListDetailsActivity::class.java)
            intent.putExtra("enterType", "chat")
            intent.putExtra("userIds", event.userId.toString())
            activity.startActivity(intent)
        }

        holder.chatSecond.setOnClickListener {
            val eventIds = event.id
            Festa.encryptedPrefs.eventIds = eventIds.toString()
            val intent = Intent(activity, EventListDetailsActivity::class.java)
            intent.putExtra("enterType", "chat")
            intent.putExtra("userIds", event.userId.toString())
            activity.startActivity(intent)
        }

        holder.photoFirst.setOnClickListener {
            val eventIds = event.id
            Festa.encryptedPrefs.eventIds = eventIds.toString()
            val intent = Intent(activity, EventListDetailsActivity::class.java)
            intent.putExtra("enterType", "photo")
            intent.putExtra("userIds", event.userId.toString())
            activity.startActivity(intent)
        }

        holder.photoSecond.setOnClickListener {
            val eventIds = event.id
            Festa.encryptedPrefs.eventIds = eventIds.toString()
            val intent = Intent(activity, EventListDetailsActivity::class.java)
            intent.putExtra("enterType", "photo")
            intent.putExtra("userIds", event.userId.toString())
            activity.startActivity(intent)
        }

        holder.guestListBtn.setOnClickListener {
            val intent = Intent(activity, GuestActivity::class.java)
            intent.putExtra("eventId", eventId)
            activity.startActivity(intent)
        }
    }

    //  var isset: Boolean = false
    inner class ViewHolder(itemView: EventlistLayoutBinding) :
        RecyclerView.ViewHolder(itemView.root) {
        // Define your views here
        val eventlinearbg: LinearLayout = itemView.eventlinearbg
        val seemore: LinearLayout = itemView.seemorelinear
        val seeless: LinearLayout = itemView.seelesslinear
        val seemoreicon: ImageView = itemView.seemoreicon
        val seelessicon: ImageView = itemView.seelessicon
        val feed: ImageView = itemView.feed
        val feed1: ImageView = itemView.feed1
        val guestlg: ImageView = itemView.guestuser
        val InvitationSee: ImageView = itemView.InvitationSee
        val editBtn: ImageView = itemView.editBtn
        val clickEditBtn: ImageView = itemView.clickView
        val guestListBtn: ImageView = itemView.guestListBtn
        val InvitationFirst: ImageView = itemView.InvitationFirst
        val eventNameElist: TextView = itemView.EventNameElist
        val eventNameMorelist: TextView = itemView.EventNameMorelist
        val eventLocElist: TextView = itemView.EventLocElist
        val eventLocMorelist: TextView = itemView.EventLocMorelist

        val eventDescMorelist: TextView = itemView.EventDescMorelist
        val dateElist: TextView = itemView.DateElist
        val dateMorelist: TextView = itemView.DateMorelist
        val timeElist: TextView = itemView.TimeElist
        val timeMorelist: TextView = itemView.TimeMorelist
        val profileimg: CircleImageView = itemView.profileimg
        val profileimg1: CircleImageView = itemView.profileimg1

        val chatFirst: ImageView = itemView.chatFirst
        val chatSecond: ImageView = itemView.chatSecond
        val photoFirst: ImageView = itemView.photoFirst
        val photoSecond: ImageView = itemView.photoSecond
    }

    override fun getItemCount(): Int {
        return eventList.size
    }

    private fun dateChange(eventDate: String, dateElist: TextView, timeElist: TextView) {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())

        // Parse the input date string to obtain a Date object
        val date = inputFormat.parse(eventDate)

        // Create a SimpleDateFormat object to format the date as "dd MMM, yyyy"
        val outputDateFormat = SimpleDateFormat("dd MMM, yyyy", Locale.getDefault())

        // Format the date
        val formattedDate = outputDateFormat.format(date)

        // Create a SimpleDateFormat object to format the time as "hh:mm a"
        val outputTimeFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())

        // Format the time
        val formattedTime = outputTimeFormat.format(date)

        // Set the formatted date and time to the TextViews
        dateElist.text = formattedDate
        timeElist.text = "-$formattedTime"
    }

    private fun isDateFormatValid(dateString: String): Boolean {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        dateFormat.isLenient = false // Disable lenient parsing
        return try {
            dateFormat.parse(dateString)
            true // Date string matches the specified format
        } catch (e: Exception) {
            false // Date string does not match the specified format
        }
    }
}