Gesture Reader
===============
제스처 리더 컴포넌트<br>이벤트 또는 포인트 좌표로 이벤트의 타입과 종류를 판별한다.

## Feature
* 각 사용 이벤트별 reader 를 생성할 수 있다.
* Flick : 터치이벤트 좌표들을 통해 이동방향및 플릭 여부를 추적한다.
	* N/E/S/W
	* NE/ES/SW/WN
	* isFlick
* LongTab : 롱탭인지 아닌지 여부를 판단한다.
* DoubleClick : 더블클릭 여부를 판별한다.

## Documentation
* **API** : https://nhnent.github.io/fe.component-gesture-reader/1.1.0
* **Tutorial** : https://github.com/nhnent/fe.component-gesture-reader/wiki/제스처-리더-컴포넌트-적용방법
* **Sample** - https://nhnent.github.io/fe.component-gesture-reader/1.1.0/tutorial-sample1.html




## Dependency
* ne-code-snippet: ~1.0.4

## Test environment
* PC
	* IE7~11
	* Chrome
	* Firefox
* Mobile
	* Galaxy Note I(Android 2.3), II(Android 4.1)
	* Galaxy S III(Android 4.0), IV(Android 4.2.2)
	* iPhone 5S(iOS 8)
	* Chrome Emulator


## Download/Install
* Bower:
   * 최신버전 : `bower install ne-component-gesture-reader#master`
   * 특정버전 : `bower install ne-component-gesture-reader[#tag]`
* Download: https://github.com/nhnent/fe.component-gesture-reader

## History
| Version | Description | Date | Developer |
| ---- | ---- | ---- | ---- |
| <a href="https://github.nhnent.com/pages/fe/component-gesture-reader/1.1.0">1.1.0</a> | 리팩토링 및 모듈 분리, API변경 | 2015.05 | FE개발팀 이제인 <jein.yi@nhnent.com> |
| <a href="https://github.nhnent.com/pages/fe/component-gesture-reader/1.0.0">1.0.0</a> | 배포 | 2015.05 | FE개발팀 이제인 <jein.yi@nhnent.com> |

## LICENSE
[MIT 라이선스](LICENSE)로 자유롭게 사용할 수 있습니다.