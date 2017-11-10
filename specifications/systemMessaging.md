# system messaging

## notification emails

### subject
>  Notification From BC Transportation Fuels Reporting System  
### body 
> You have received a notification. Please log into the TFRS system to view the details and to manage your notification settings.

##sms text
### body 
> Notification from the BC Transportation Fuels Reporting System. Please log in to view the details and to manage your notification settings.

##  400 Bad Request

>  We're sorry.
>
>  We can't figure out what you are requesting. You might have a typo...

The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).[[31\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-rfc7231-400-32)

## 401 Unauthorized ([RFC 7235](https://tools.ietf.org/html/rfc7235))

> We're sorry.
>
> It looks like your account credentials are not getting through to the website, or our system might not be able to communicate with your IP address.

Similar to *403 Forbidden*, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. See [Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) and [Digest access authentication](https://en.wikipedia.org/wiki/Digest_access_authentication).[[32\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-33) 401 semantically means ["unauthenticated"](https://en.wikipedia.org/wiki/Authentication),[[33\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-rfc7235-401-34) i.e. the user does not have the necessary credentials.

Note: Some sites issue HTTP 401 when an [IP address](https://en.wikipedia.org/wiki/IP_address) is banned from the website (usually the website domain) and that specific address is refused permission to access a website.

## 403[ Forbidden](https://en.wikipedia.org/wiki/HTTP_403)

> Hello,
>
> Welcome to the Transportation Fuel Reporting System. It looks like you don't have an account setup yet, or that you are trying to access a page that you do not have permissions to see.
>
> You will need to <a href="#">contact us</a> for help 

The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource, or may need an account of some sort.

## 404 Not Found

> We give you credit for trying to find a valid page, but this is not it.  
>
> to trade this page for a valid one click <a href="/">here</a>  
>
> or learn more about Credit Validation <a href="http://www.gov.bc.ca/lowcarbonfuels/">here</a>

The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.[[36\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-37)

## 405 Method Not Allowed

> It looks like you are trying to be creative in how you interact with our system.  Unfortunately you are trying to use a request method that is not allowed.

A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via [POST](https://en.wikipedia.org/wiki/POST_(HTTP)), or a PUT request on a read-only resource.

## 408 Request Timeout

> We're sorry.
>
> We thought you left. Your request will need to start over.  Perhaps try to get all your information ready before you start the process of submitting your request.

The server timed out waiting for the request. According to HTTP specifications: "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time."[[39\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-40)

## 415 Unsupported Media Type

> We're sorry
>
> That type of file won't work. Can you try one of the other file types that we do support?

The request entity has a [media type](https://en.wikipedia.org/wiki/Internet_media_type) which the server or resource does not support. For example, the client uploads an image as [image/svg+xml](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics), but the server requires that images use a different format.

## 422 Unprocessable Entity

> We're sorry
>
> Looks like you are trying to submit some information that we can't process.

The 422 (Unprocessable Entity) status code means the server understands the content type of the request entity (hence a 415(Unsupported Media Type) status code is inappropriate), and the syntax of the request entity is correct (thus a 400 (Bad Request) status code is inappropriate) but was unable to process the contained instructions. For example, this error condition may occur if an XML request body contains well-formed (i.e., syntactically correct), but semantically erroneous, XML instructions.

## 500 Internal Server Error

> We're sorry.
>
> It looks like our system took an unexpected break. We have been notified and will look into it.

A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.[[57\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-58)

## 501 Not Implemented

> We appreciate your willingness to try new things.
>
> But this request method is not quite ready yet. 

The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability (e.g., a new feature of a web-service API).[[58\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-59)

## 502 Bad Gateway

> We're sorry.
>
> While trying to process your request, we got an invalid response from another computer.

The server was acting as a [gateway](https://en.wikipedia.org/wiki/Gateway_(telecommunications)) or proxy and received an invalid response from the upstream server.[[59\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-60)

## 503 Service Unavailable

> We're sorry.
>
> Our system felt over worked and decided to take a coffee break.  We'll get it back up and running soon.

The server is currently unavailable (because it is overloaded or down for maintenance). Generally, this is a temporary state.[[60\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-61)

## 504 Gateway Timeout

> We're sorry.
>
> The system had to wait too long, and stopped trying to load the next page.

The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.[[61\]](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#cite_note-62)
