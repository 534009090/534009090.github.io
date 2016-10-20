<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<h2 id="time"></h2>
<script> 
  setInterval("document.getElementById('time').innerHTML=new Date  ().toLocaleString()+' 星期'+'日一二三四五六'.charAt(new Date().getDay  ());",1000); 
<script>
</body>
</html>


