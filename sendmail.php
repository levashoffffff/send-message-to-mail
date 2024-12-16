<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'PHPMailer/language/');
$mail->isHTML(true);

//От кого письмо
$mail->setForm('toyroom@mail.ru', 'Моя форма');
//Кому отправить
$mail->addAddress('artur.levashoff@gmail.com');
//Тема письма
$mail->Subject = 'Добрый день! Вас интересуют мягкие игрушки';


//Рука
$hand = 'Правая';
if($_POST['hand'] == 'left') {
    $hand = 'Левая';
}

//Тело письма
$body = '<h1>Встречайте супер игрушки!</h1>';

if(trim(!empty($_POST['name']))) {
    $body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
}
if(trim(!empty($_POST['email']))) {
    $body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
}
if(trim(!empty($_POST['hand']))) {
    $body.='<p><strong>Рука:</strong> '.$hand.'</p>';
}
if(trim(!empty($_POST['age']))) {
    $body.='<p><strong>Возраст:</strong> '.$_POST['age'].'</p>';
}
if(trim(!empty($_POST['message']))) {
    $body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
}

//Прикрепить файл
if(!empty($_FILES['image']['tmp_name'])) {
    //путь загрузки файла
    $filePath = __DIR__ . "files/" . $_FILES['image']['name'];
    //грузим файл
    if(copy($_FILES['image']['tmp_name'], $filePath)) {
        $fileAttach = $filePath;
        $body.='<p><strong>Фото в приложении</strong></p>';
        $mail->addAttachment($fileAttach);
    }
}

$mail->Body = $body;

//Отправка
if(!$mail->send()) {
    $message = 'Ошибка';
}else {
    $message = 'Данные отправлены!';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);

?>
