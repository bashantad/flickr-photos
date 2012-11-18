$(document).ready(function(){
	$(".favIcon").live("click",function(){
		var photoId = $(this).parents(".photo:first");
		var id = photoId.attr("id");
		$.ajax({
			method: 'post',
			data: 'id='+id,
			dataType:'json',
			url:'http://localhost/flickr-photos/ajax.php',
			success:function(res){
				photoId.find(".favIcon").attr("class",res.val);				
			},
			error:function(res){
				console.log("Ajax failed");
			}
		});
	});
});
