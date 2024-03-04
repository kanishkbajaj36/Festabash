package com.example.festa.view.events.adapters

import android.app.Dialog
import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.BuildConfig
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.interfaces.OnItemClickListenerDeleteImage
import com.example.festa.view.events.viewmodel.particularalbumimageslist.ParticularAlbumImagesResponse

class PhotosAdapter(
    private val list: ArrayList<ParticularAlbumImagesResponse.ImageEntry>,
    private val context: Context,
    private val album_ids: String?,
    private val itemClickListenerDeleteImage: OnItemClickListenerDeleteImage,
    private val counts: Int,
    private var createdUserId: String,
) :
    RecyclerView.Adapter<PhotosAdapter.ViewHolder>() {
    //create new views
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        //val binding: PhotoslayoutBinding = PhotoslayoutBinding.inflate(LayoutInflater.from(context), parent, false)
        //return ViewHolder(binding)

        return if (counts == 2) {
            ViewHolder(
                LayoutInflater.from(parent.context)
                    .inflate(R.layout.photostwolayout, parent, false)
            )
        } else {
            ViewHolder(
                LayoutInflater.from(parent.context)
                    .inflate(R.layout.photoslayout, parent, false)
            )
        }
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        //val ItemsViewModel = mList[position]
        /*Glide
            .with(context)
            .load(R.drawable.girl5)
            .into(holder.albumImg)*/

        val imageUrls = BuildConfig.IMAGE_KEY + "" + list[position].imagePath
        Glide
            .with(context)
            .load(imageUrls)
            .placeholder(R.drawable.gallery_shade)
            .into(holder.albumImg)

        Glide.with(context)
            .load(R.drawable.trash)
            .into(holder.deleteImg)


        val userId = Festa.encryptedPrefs.UserId

        Log.e("createdUserIdA","createdUserId " + createdUserId  +" userdId " +userId)

        if (createdUserId == userId)
        {
            holder.deleteImg.visibility = View.VISIBLE
        }
        else
        {
            holder.deleteImg.visibility = View.GONE
        }

        holder.deleteImg.setOnClickListener {
            val layoutDialog = Dialog(context)
            layoutDialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
            layoutDialog.setContentView(R.layout.delete_guest_layout)
            val titleTxt = layoutDialog.findViewById<TextView>(R.id.titleTxt)
            val noDialog = layoutDialog.findViewById<LinearLayout>(R.id.noDialog)
            val yesDialog = layoutDialog.findViewById<LinearLayout>(R.id.yesDialog)

            val imageId = list[position].id



            titleTxt.text = context.resources.getString(R.string.delete_img_from_album)

            val window = layoutDialog.window
            window!!.setLayout(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )

            yesDialog.setOnClickListener {
                if (imageId != null) {
                    itemClickListenerDeleteImage.onDeleteImageClick(position, imageId, album_ids)
                }
                layoutDialog.dismiss()
            }

            noDialog.setOnClickListener { layoutDialog.dismiss() }

            layoutDialog.show()
        }
    }


    override fun getItemCount(): Int {
        return list.size
    }

    /* class ViewHolder(view: PhotoslayoutBinding) : RecyclerView.ViewHolder(view.root) {
         val albumImg: ImageView = view.albumImg
         val deleteImg: ImageView = view.deleteImg
     }*/

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        var albumImg: ImageView
        var deleteImg: ImageView

        init {
            albumImg = itemView.findViewById(R.id.albumImg)
            deleteImg = itemView.findViewById(R.id.deleteImg)
        }
    }
}