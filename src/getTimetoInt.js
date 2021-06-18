function getTimetoInt(time){
  var nums = [];
  var sum = 0;
  nums = time.split(':');

  //":"の数が0個の場合（1分未満)
  if(nums.length == 1){
    console.log("1分未満");
    temp = nums[nums.length-1].split('.');
    //小数を含む場合
    if(temp.length == 2){
      console.log("小数あり");
      sum += Number(temp[0]) * 1000;
      sum += Number(temp[1]) * 100;
    }
    //小数を含まない場合
    else if(temp.length == 1){
      console.log("小数なし");
      sum += Number(nums[0]) * 1000;
    }
  }
  // ":" の数が1つの場合 (1時間未満)
  else if(nums.length == 2){
    console.log("1時間未満")
    temp = nums[nums.length-1].split('.');
    //小数を含む場合
    if(temp.length == 2){
      console.log("小数あり");
      sum += Number(nums[0]) * 60000;
      sum += Number(temp[0]) * 1000;
      sum += Number(temp[1]) * 100;
    }
    //小数を含まない場合
    else if(temp.length == 1){
      console.log("小数なし");
      sum += Number(nums[0]) * 60000;
      sum += Number(nums[1]) * 1000;
    }

  }
  // ":" の数が2つの場合 (1時間以上)
  else if(nums.length == 3){
    console.log("1時間以上");
    temp = nums[nums.length-1].split('.');
    //小数を含む場合
    if(temp.length == 2){
      console.log("小数あり");
      sum += Number(nums[0]) * 3600000;
      sum += Number(nums[1]) * 60000;
      sum += Number(temp[0]) * 1000;
      sum += Number(temp[1]) * 100;

    }
    //小数を含まない場合
    else if(temp.length == 1){
      console.log("小数なし");
      sum += Number(nums[0]) * 3600000;
      sum += Number(nums[1]) * 60000;
      sum += Number(nums[2]) * 1000;
    }

  }

  return sum;
};