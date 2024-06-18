export default function getText(id: number, code: string, domain: string) {
    return `<p>Добро пожаловать в Books App! Здесь вы сможете найти весь интересующий спектр книг</p>
<p>Для подтверждения почты нажмите на кнопку ниже:</p>
<div style="height: 60px; display: flex; justify-content: center; align-items: center;"><a href="${domain}/users/verify/?id=${id}&code=${code}"
        style="padding: 10px; background: #9dff1e; color: #000; text-decoration: none; border-radius: 8px;">Подтвердить</a>
</div>
<p>Если кнопка не работает, воспользуйтесь ссылкой ${domain}/users/verify/?id=${id}&code=${code}</p>
<p>Если это не вы создали аккаунт, то проигнорируйте это письмо</p>`;
}
