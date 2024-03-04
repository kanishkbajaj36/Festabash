package com.example.festa.adapters

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.text.format.DateUtils
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.BuildConfig
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.interfaces.OnItemClickListenerDeleteImage
import com.example.festa.ui.Feedinfo
import com.example.festa.view.events.viewmodel.feedslist.FeedsListResponse
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*


class FeedAdapter(
    private val context: Context,
    private var list: ArrayList<FeedsListResponse.Feeds>,
    private val itemClickListenerDeleteImage: OnItemClickListenerDeleteImage,
    private var createdUserId: String
) :
    RecyclerView.Adapter<FeedAdapter.ViewHolder>() {
    var isset: Boolean = false
    //private val list: ArrayList<FeedsListResponse.Feeds>,

    // create new views
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.feedlayout, parent, false)

        return ViewHolder(view)
    }

    @SuppressLint("NotifyDataSetChanged")
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        // val ItemsViewModel = mList[position]

        val userId = Festa.encryptedPrefs.UserId
        val createUserId = list[position].userId
        if (userId == createdUserId) {
            holder.menuBtn.visibility = View.VISIBLE
        } else {
            holder.menuBtn.visibility = View.GONE
        }

        holder.feedview.setOnClickListener {
            val intent = Intent(context, Feedinfo::class.java)
            context.startActivity(intent)
        }

        holder.commentsLayout.setOnClickListener {
            itemClickListenerDeleteImage.onAddCommentClick(list[position].feed_id)
        }

        holder.likeDislikeLayout.setOnClickListener {
            itemClickListenerDeleteImage.onLikeDislikeClick(list[position].feed_id)
        }

        holder.menuBtn.setOnClickListener {
            // val wrapper: Context = ContextThemeWrapper(applicationContext, R.style.PopupMenu_style)
            val popupMenu = PopupMenu(context, holder.menuBtn)
            popupMenu.menuInflater.inflate(R.menu.menu_feed, popupMenu.menu)
            popupMenu.setOnMenuItemClickListener { item ->
                when (item.itemId) {
                    R.id.deleteAlbum -> {
                        itemClickListenerDeleteImage.onFeedDeleteClick(list[position].feed_id)
                        true
                    }
                    else -> false
                }
            }
            popupMenu.show()
        }

        val dateTime = list[position].feed_created_time
        @SuppressLint("SimpleDateFormat") val sdf = SimpleDateFormat("yyyy-MM-dd kk:mm:ss")
        try {
            val time = Objects.requireNonNull(sdf.parse(dateTime)).time
            val currentDateandTime = sdf.format(Date())
            val currentDT = sdf.parse(currentDateandTime)
            val now = Objects.requireNonNull(currentDT).time
            val ago = DateUtils.getRelativeTimeSpanString(time, now, DateUtils.MINUTE_IN_MILLIS)
            holder.dateTimeTxt.text = "Posted : $ago"
        } catch (e: ParseException) {
            e.printStackTrace()
            Log.e("eventId", "ParseException:  $e ")
        }

        holder.userNameTxt.text = list[position].userName
        holder.descriptionTxt.text = list[position].feed_description
        holder.likeTxt.text = list[position].feed_likes.toString()
        holder.commentTxt.text = list[position].feed_comments.toString()
        holder.viewTxt.text = list[position].feed_views.toString()

        val imageUrls = BuildConfig.IMAGE_KEY + "" + list[position].user_profileImage
        val feedsUrls = BuildConfig.IMAGE_KEY + "" + list[position].feed_image

        Glide
            .with(context)
            .load(imageUrls)
            .into(holder.userImg)

        Glide
            .with(context)
            .load(feedsUrls)
            .into(holder.feedsImg)
    }

    override fun getItemCount(): Int {
        return list.size
    }

    @SuppressLint("NotifyDataSetChanged")
    fun addFeeds(lists: ArrayList<FeedsListResponse.Feeds>) {
        list = lists
        notifyDataSetChanged()
    }

    class ViewHolder(ItemView: View) : RecyclerView.ViewHolder(ItemView) {
        val commentsLayout: LinearLayout = ItemView.findViewById(R.id.commentsLayout)
        val likeDislikeLayout: LinearLayout = ItemView.findViewById(R.id.likeDislikeLayout)
        val feedview: LinearLayout = ItemView.findViewById(R.id.views)
        val feedsImg: ImageView = itemView.findViewById(R.id.feedsImg)
        val userImg: ImageView = itemView.findViewById(R.id.userImg)
        val menuBtn: ImageView = itemView.findViewById(R.id.menuBtn)
        val userNameTxt: TextView = itemView.findViewById(R.id.userNameTxt)
        val descriptionTxt: TextView = itemView.findViewById(R.id.descriptionTxt)
        val dateTimeTxt: TextView = itemView.findViewById(R.id.dateTimeTxt)
        val likeTxt: TextView = itemView.findViewById(R.id.likeTxt)
        val commentTxt: TextView = itemView.findViewById(R.id.commentTxt)
        val viewTxt: TextView = itemView.findViewById(R.id.viewTxt)
    }

}