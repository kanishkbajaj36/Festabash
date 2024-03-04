package com.example.festa.view.invitedbyanyhost.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.festa.databinding.InviteEventLayoutBinding

class MultipleEventAdapter(
    private val context: Context
) :
    RecyclerView.Adapter<MultipleEventAdapter.ViewHolder>() {
    //create new views
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding: InviteEventLayoutBinding =
            InviteEventLayoutBinding.inflate(LayoutInflater.from(context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        //val ItemsViewModel = mList[position]
        /*Glide
            .with(context)
            .load(R.drawable.girl5)
            .into(holder.albumImg)*/
    }

    override fun getItemCount(): Int {
        return 10
    }

    class ViewHolder(view: InviteEventLayoutBinding) : RecyclerView.ViewHolder(view.root) {
        //val userNameTxt: TextView = view.userNameTxt
    }
}