package com.example.festa.view.events.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.BuildConfig
import com.example.festa.R
import com.example.festa.databinding.CommentRecyclerViewDataBinding
import com.example.festa.view.events.viewmodel.commentlist.CommentListResponse

class CommentAdapter(
    private val list: ArrayList<CommentListResponse.AllComments>,
    private val context: Context) :
    RecyclerView.Adapter<CommentAdapter.ViewHolder>() {
    //create new views
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding: CommentRecyclerViewDataBinding =
            CommentRecyclerViewDataBinding.inflate(LayoutInflater.from(context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        //val ItemsViewModel = mList[position]
        /*Glide
            .with(context)
            .load(R.drawable.girl5)
            .into(holder.albumImg)*/

        val imageUrls = BuildConfig.IMAGE_KEY + "" + list[position].user_image
        Glide
            .with(context)
            .load(imageUrls)
            .placeholder(R.drawable.gallery_shade)
            .into(holder.images)

        holder.userNameTxt.text = list[position].userName
        holder.commentMessageTxt.text = list[position].text_comment

    }


    override fun getItemCount(): Int {
        return list.size
    }

    class ViewHolder(view: CommentRecyclerViewDataBinding) : RecyclerView.ViewHolder(view.root) {
        val userNameTxt: TextView = view.userNameTxt
        val commentMessageTxt: TextView = view.commentMessageTxt
        val images: ImageView = view.images
    }
}