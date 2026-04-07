from rest_framework.throttling import UserRateThrottle


class LoginRateThrottle(UserRateThrottle):
    scope = "login"

class TransferRateThrottle(UserRateThrottle):
    scope = "transfer"

    def get_cache_key(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return None

        ident = request.user.id
        return self.cache_format % {
            "scope": self.scope,
            "ident": ident
        }
    
    