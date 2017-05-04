    $scope.checkAllFieldsPresent = function () {
      if ($scope.requestedListingData) {
        var atleastOneBookableSelected = false;
        var nowTemp = new Date();
        var currentDate = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
        var checkInDate = moment($scope.requestedListingData.date_from, 'DD/MM/YYYY');
        var checkOutDate = moment($scope.requestedListingData.date_until, 'DD/MM/YYYY');

        var isTodayCheckIn = checkInDate.valueOf() == currentDate.getTime();
        var isPastCheckInDate = checkInDate.toDate() < currentDate;


        angular.forEach($scope.requestedListingData.bookables, function (value, key) {
          if (!atleastOneBookableSelected && value && value.requested > 0) { Added //!atleastOneBookableSelected or use native for loop for performance
            atleastOneBookableSelected = true;
          }
        });

        if ($scope.packeageType === 1) {
          if (!checkInDate.isValid() || !checkOutDate.isValid()) {
            $scope.showMessage('Please select your check-in and check-out dates');
            return false;
          } else {
            if (isPastCheckInDate) {
              $scope.showMessage('Please check-in date cannot be in past');
              return false;
            }
          }
        } else {
          if (!checkInDate.isValid()) {
            $scope.showMessage('Please select your check-in and check-out dates');
            return false;
          } else {
            // hack to get statup tour request video working
            if (isPastCheckInDate) {
              if ($scope.listing.code === 'startuptour' && $scope.listing.config['default_date']) {
                angular.forEach($scope.requestedListingData.bookables, function (bookable) {
                  bookable.requested = 1;
                });
                return true;
              }

              $scope.showMessage('Please check-in date cannot be in past');
              return false;
            }
          }
        }

        if (!atleastOneBookableSelected) {
          $scope.showMessage('Please select atleast one stay/experience');
          return false;
        } else if (isTodayCheckIn && nowTemp.getHours() >= 24 - $scope.configs.min_hours_for_booking) {
          $scope.showMessage('Booking is closed for today. Please try for next day.');
          return false;
        } else {
          return true;
        }
      } else {
        $scope.showMessage("Internal error, please refresh the page and continue");
        return false;
      }
    }